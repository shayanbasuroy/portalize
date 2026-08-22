import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { PinAuthForm } from '@/components/portal/PinAuthForm'
import { asSingle } from '@/lib/utils'

interface AuthPageProps {
  params: Promise<{ slug: string }>
}

export default async function PortalAuthPage({ params }: AuthPageProps) {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: project, error } = await admin
    .from('projects')
    .select('title, freelancers(logo_url, brand_color, business_name)')
    .eq('slug', slug)
    .single()

  if (error || !project) {
    notFound()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F7FC] p-4">
      <PinAuthForm
        slug={slug}
        projectTitle={project.title}
        freelancerBrand={asSingle(project.freelancers) || null}
      />
    </div>
  )
}
