import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { PortalView } from '@/components/portal/PortalView'

interface PortalPageProps {
  params: Promise<{ slug: string }>
}

// File deliverables live in a private bucket. To render them in the browser we
// mint short-lived, view-only signed URLs server-side (raw storage paths would
// 403). Downloads stay gated behind /api/download + payment_status.
async function enrichDeliverablesWithPreviewUrls(deliverables: any[]) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !deliverables?.length) {
    return deliverables
  }

  const admin = createAdminClient()

  return Promise.all(
    deliverables.map(async (deliverable) => {
      const previewable =
        deliverable.deliverable_type === 'file' &&
        deliverable.content_url &&
        (deliverable.mime_type?.startsWith('image/') ||
          deliverable.mime_type === 'application/pdf')

      if (!previewable) return deliverable

      try {
        const { data } = await admin.storage
          .from('deliverables-bucket')
          .createSignedUrl(deliverable.content_url, 60 * 15) // 15 min, view-only
        return { ...deliverable, preview_url: data?.signedUrl ?? null }
      } catch {
        return { ...deliverable, preview_url: null }
      }
    })
  )
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { slug } = await params

  // Verify session cookie
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(`client_session_${slug}`)

  if (!sessionCookie || sessionCookie.value !== 'verified') {
    redirect(`/p/${slug}/auth`)
  }

  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*, freelancers(*), deliverables(*, feedback_comments(*))')
    .eq('slug', slug)
    .single()

  if (error || !project) {
    notFound()
  }

  const deliverables = await enrichDeliverablesWithPreviewUrls(
    project.deliverables || []
  )

  return (
    <PortalView initialProject={project} initialDeliverables={deliverables} />
  )
}
