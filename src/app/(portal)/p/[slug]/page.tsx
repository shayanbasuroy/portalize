import React from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyPortalSessionToken } from '@/lib/session'
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

  // Verify session cookie (HMAC-signed token)
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(`client_session_${slug}`)

  if (!sessionCookie || !(await verifyPortalSessionToken(slug, sessionCookie.value))) {
    redirect(`/p/${slug}/auth`)
  }

  // Service role: the client is anonymous, and this read is gated by the
  // verified session cookie above. `access_pin` is deliberately excluded from
  // what reaches the browser.
  const admin = createAdminClient()

  const { data: project, error } = await admin
    .from('projects')
    .select('id, slug, title, project_status, payment_status, watermark_enabled, invoice_url, invoice_amount, freelancers(business_name, logo_url, brand_color), deliverables(*, feedback_comments(*))')
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
