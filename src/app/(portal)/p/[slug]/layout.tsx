import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { asSingle } from '@/lib/utils'
import React from 'react'

interface PortalLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function PortalLayout({ children, params }: PortalLayoutProps) {
  const { slug } = await params
  // Service role: the client is anonymous, so reading `freelancers` branding via
  // the anon role returns null (no anon policy on that table). The service role
  // bypasses RLS and is safe here because this is a server-only render.
  const admin = createAdminClient()

  const { data: project, error } = await admin
    .from('projects')
    .select('freelancers(brand_color)')
    .eq('slug', slug)
    .single()

  if (error || !project) {
    notFound()
  }

  const freelancer = asSingle(project.freelancers)
  const brandColor = freelancer?.brand_color || '#151B45'

  return (
    <div
      className="min-h-screen bg-[#F8F7FC]"
      style={{
        '--brand-color': brandColor,
      } as React.CSSProperties}
    >
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
