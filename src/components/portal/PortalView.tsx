'use client'

import React from 'react'
import { useRealtimeProject } from '@/hooks/useRealtimeProject'
import { useRealtimeDeliverables } from '@/hooks/useRealtimeDeliverables'
import { PaymentBanner } from './PaymentBanner'
import { DeliverablePortalCard } from './DeliverablePortalCard'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Lock } from 'lucide-react'
import { approveProjectAction } from '@/app/actions/portal'
import { vibrate } from '@/lib/haptics'

interface PortalViewProps {
  initialProject: any
  initialDeliverables: any[]
}

const statusLabels: Record<string, string> = {
  in_review: 'In review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
}

export function PortalView({ initialProject, initialDeliverables }: PortalViewProps) {
  // Live state: Supabase Realtime re-renders when the freelancer flips
  // payment_status (unlocking downloads) or a deliverable is approved.
  const project = useRealtimeProject(initialProject)
  const deliverables = useRealtimeDeliverables(initialProject.id, initialDeliverables)

  if (!project) return null

  const freelancerBrand = Array.isArray(project.freelancers)
    ? project.freelancers[0]
    : project.freelancers

  const businessName = freelancerBrand?.business_name || 'Freelancer'
  const sorted = [...deliverables].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  const approvedCount = sorted.filter((d) => d.status === 'approved').length
  const isApproved = project.project_status === 'approved'

  return (
    <div className="border border-zinc-200 bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-zinc-200 px-5 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 bg-zinc-300" />
          <span className="size-2.5 bg-zinc-300" />
          <span className="size-2.5 bg-zinc-300" />
        </span>
        <span className="ml-3 truncate font-mono text-[11px] text-zinc-400">
          portalize.app/p/{project.slug}
        </span>
        <span className="ml-auto hidden items-center gap-1.5 font-mono text-[11px] text-zinc-400 sm:flex">
          <Lock className="size-3" strokeWidth={2} />
          Private
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div className="min-w-0">
          {/* Project header */}
          <div className="flex items-start justify-between gap-4 px-5 py-6 sm:px-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                {businessName} · Project
              </p>
              <h1 className="mt-1.5 text-xl font-medium tracking-tight text-[#151B45]">
                {project.title}
              </h1>
            </div>
            <span className="shrink-0 border border-zinc-200 px-2.5 py-1 font-mono text-[11px] text-zinc-500">
              {statusLabels[project.project_status] || project.project_status}
            </span>
          </div>

          {/* Payment banner */}
          {project.payment_status === 'unpaid' && <PaymentBanner />}

          {/* Deliverables */}
          <div className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200">
            {sorted.map((deliverable) => (
              <DeliverablePortalCard
                key={deliverable.id}
                deliverable={deliverable}
                project={{
                  id: project.id,
                  slug: project.slug,
                  payment_status: project.payment_status,
                  watermark_enabled: project.watermark_enabled,
                }}
              />
            ))}

            {sorted.length === 0 && (
              <div className="px-5 py-16 text-center">
                <p className="text-sm text-zinc-500">
                  No deliverables have been added to this project yet.
                </p>
              </div>
            )}
          </div>

          {/* Approve bar */}
          {sorted.length > 0 && !isApproved && (
            <div className="flex items-center justify-between gap-4 border-t border-zinc-200 px-5 py-4 sm:px-6">
              <p className="font-mono text-[11px] text-zinc-400">
                {sorted.length} deliverable{sorted.length === 1 ? '' : 's'} ·{' '}
                {approvedCount} approved
              </p>
              <form action={approveProjectAction}>
                <input type="hidden" name="projectId" value={project.id} />
                <input type="hidden" name="slug" value={project.slug} />
                <Button
                  type="submit"
                  variant="outline"
                  onClick={() => vibrate(20)}
                  className="border-[#151B45] text-[#151B45] hover:bg-[#151B45] hover:text-[#F8F7FC]"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve project
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="border-t border-zinc-200 lg:border-l lg:border-t-0">
          <div className="space-y-6 p-5 sm:p-6">
            {/* Freelancer */}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                Delivered by
              </p>
              <div className="mt-3 flex items-center gap-3">
                {freelancerBrand?.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={freelancerBrand.logo_url}
                    alt={businessName}
                    className="size-10 border border-zinc-200 bg-white object-contain"
                  />
                ) : (
                  <span
                    className="flex size-10 items-center justify-center text-sm font-medium text-[#F8F7FC]"
                    style={{ backgroundColor: 'var(--brand-color, #151B45)' }}
                  >
                    {businessName.charAt(0).toUpperCase()}
                  </span>
                )}
                <p className="min-w-0 text-sm font-medium text-[#151B45]">
                  {businessName}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="border-t border-zinc-200 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                Status
              </p>
              <dl className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Project</dt>
                  <dd className="font-medium text-[#151B45]">
                    {statusLabels[project.project_status] || project.project_status}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Payment</dt>
                  <dd
                    className={
                      project.payment_status === 'paid'
                        ? 'font-medium text-emerald-600'
                        : 'font-medium text-amber-600'
                    }
                  >
                    {project.payment_status === 'paid' ? 'Paid' : 'Pending'}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-500">Deliverables</dt>
                  <dd className="font-medium text-[#151B45]">{sorted.length}</dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
