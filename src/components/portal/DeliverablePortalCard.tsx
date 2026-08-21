'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Download,
  FileEdit,
  CheckCircle2,
  Lock,
  ExternalLink,
  FileArchive,
  FileCode2,
  Link2,
  MonitorPlay,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import { ImageViewer } from '../previewers/ImageViewer'
import { EmbedViewer } from '../previewers/EmbedViewer'
import { WatermarkOverlay } from './WatermarkOverlay'
import { FeedbackDrawer } from './FeedbackDrawer'
import { approveDeliverableAction, logPreviewAction } from '@/app/actions/portal'
import { vibrate } from '@/lib/haptics'

const CodeViewer = dynamic(
  () => import('../previewers/CodeViewer').then((mod) => mod.CodeViewer),
  { ssr: false }
)
const DocViewer = dynamic(
  () => import('../previewers/DocViewer').then((mod) => mod.DocViewer),
  { ssr: false }
)

const typeIcons = {
  file: FileArchive,
  code: FileCode2,
  link: Link2,
  embed: MonitorPlay,
} as const

function statusMeta(status: string) {
  switch (status) {
    case 'approved':
      return { label: 'Approved', className: 'text-emerald-600' }
    case 'changes_requested':
      return { label: 'Changes requested', className: 'text-amber-600' }
    default:
      return { label: 'Pending', className: 'text-zinc-500' }
  }
}

interface DeliverablePortalCardProps {
  deliverable: any
  project: {
    id: string
    slug: string
    payment_status: string
    watermark_enabled: boolean
  }
}

export function DeliverablePortalCard({ deliverable, project }: DeliverablePortalCardProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const loggedPreview = useRef(false)

  // Log a granular read receipt once per card mount (the client rendered this
  // deliverable's preview). The ref guards against double-logging on re-renders.
  useEffect(() => {
    if (loggedPreview.current) return
    loggedPreview.current = true
    const form = new FormData()
    form.set('deliverableId', deliverable.id)
    form.set('slug', project.slug)
    logPreviewAction(form)
  }, [deliverable.id, project.slug])

  const isPaid = project.payment_status === 'paid'
  const isApproved = deliverable.status === 'approved'
  const TypeIcon = typeIcons[deliverable.deliverable_type as keyof typeof typeIcons] ?? FileArchive
  const status = statusMeta(deliverable.status)

  const renderPreview = () => {
    switch (deliverable.deliverable_type) {
      case 'code':
        return (
          <CodeViewer
            code={deliverable.code_content || ''}
            language={deliverable.code_language || 'javascript'}
            isPaid={isPaid}
          />
        )
      case 'file': {
        const previewUrl = deliverable.preview_url
        if (!previewUrl) {
          return (
            <div className="border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
              Preview not available for this file type.
            </div>
          )
        }
        if (deliverable.mime_type?.startsWith('image/')) {
          return <ImageViewer src={previewUrl} alt={deliverable.title} />
        }
        if (deliverable.mime_type === 'application/pdf') {
          return <DocViewer url={previewUrl} />
        }
        return (
          <div className="border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
            Preview not available for this file type.
          </div>
        )
      }
      case 'embed':
        return <EmbedViewer url={deliverable.content_url} />
      case 'link':
        return (
          <div className="border border-zinc-200 bg-zinc-50 p-6">
            <a
              href={deliverable.content_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#151B45] underline underline-offset-4 hover:text-zinc-600"
            >
              <ExternalLink className="h-4 w-4" />
              Open external link
            </a>
            <p className="mt-1 truncate font-mono text-xs text-zinc-400">
              {deliverable.content_url}
            </p>
          </div>
        )
      default:
        return null
    }
  }

  const wrapWithWatermark = (content: React.ReactNode) => {
    if (
      !isPaid &&
      project.watermark_enabled &&
      ['file', 'code'].includes(deliverable.deliverable_type)
    ) {
      return (
        <div className="relative overflow-hidden border border-zinc-200">
          {content}
          <WatermarkOverlay />
        </div>
      )
    }
    return content
  }

  const preview = renderPreview()

  return (
    <div className="px-5 py-5 sm:px-6">
      {/* Header row — icon square, title, mono meta, status */}
      <div className="flex items-center gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center border border-zinc-200 text-[#151B45]">
          <TypeIcon className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#151B45]">
            {deliverable.title}
          </p>
          <p className="truncate font-mono text-[11px] text-zinc-400">
            {deliverable.deliverable_type}
            {deliverable.file_size
              ? ` · ${(deliverable.file_size / 1024 / 1024).toFixed(2)} MB`
              : ''}
          </p>
        </div>
        <span className={`shrink-0 font-mono text-[11px] ${status.className}`}>
          {status.label}
        </span>
      </div>

      {/* Preview */}
      {preview && <div className="mt-4">{wrapWithWatermark(preview)}</div>}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFeedbackOpen(true)}>
            <FileEdit className="mr-2 h-4 w-4" />
            Request Changes
            {deliverable.feedback_comments?.length > 0 && (
              <span className="ml-1 font-mono text-xs text-zinc-400">
                ({deliverable.feedback_comments.length})
              </span>
            )}
          </Button>

          {!isApproved && (
            <form action={approveDeliverableAction}>
              <input type="hidden" name="deliverableId" value={deliverable.id} />
              <input type="hidden" name="slug" value={project.slug} />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => vibrate(15)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </form>
          )}
        </div>

        {(deliverable.deliverable_type === 'file' || deliverable.deliverable_type === 'code') &&
          (isPaid ? (
            <Button
              render={
                <a href={`/api/download?deliverableId=${deliverable.id}&slug=${project.slug}`} />
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          ) : (
            <Button disabled variant="secondary" className="cursor-not-allowed text-zinc-500">
              <Lock className="mr-2 h-4 w-4" />
              Download Locked
            </Button>
          ))}
      </div>

      <FeedbackDrawer
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        deliverable={deliverable}
        slug={project.slug}
      />
    </div>
  )
}
