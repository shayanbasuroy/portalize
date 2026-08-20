'use client'

import React, { useActionState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { submitFeedbackAction, PortalActionState } from '@/app/actions/portal'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { toast } from 'sonner'
import { Loader2, Send, X } from 'lucide-react'
import { formatRelativeTime } from '@/lib/format'

interface FeedbackDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deliverable: any
  slug: string
}

const initialState: PortalActionState = {}

export function FeedbackDrawer({ open, onOpenChange, deliverable, slug }: FeedbackDrawerProps) {
  const [state, formAction, isPending] = useActionState(submitFeedbackAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      formRef.current?.reset()
    } else if (state?.message && !state.success) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 pb-4 pt-3">
        <div>
          <h2 className="text-base font-medium tracking-tight text-[#151B45]">
            Request Changes
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Feedback for &ldquo;{deliverable.title}&rdquo;
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="flex size-8 shrink-0 items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-[#151B45]"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Comments */}
      <div className="space-y-5 px-5 py-4">
        {deliverable.feedback_comments?.length > 0 ? (
          deliverable.feedback_comments.map((comment: any) => (
            <div
              key={comment.id}
              className={`flex flex-col ${comment.sender_role === 'client' ? 'items-end' : 'items-start'}`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-[#151B45]">
                  {comment.author_name}
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  {formatRelativeTime(comment.created_at)}
                </span>
              </div>
              <div
                className={`max-w-[85%] px-3 py-2 text-sm ${
                  comment.sender_role === 'client'
                    ? 'bg-[#151B45] text-[#F8F7FC]'
                    : 'bg-zinc-100 text-[#151B45]'
                }`}
              >
                <p className="whitespace-pre-wrap">{comment.comment_text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-zinc-500">
            No feedback yet. Leave a comment below.
          </div>
        )}
      </div>

      {/* Form */}
      <div className="border-t border-zinc-200 px-5 py-4">
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="deliverableId" value={deliverable.id} />
          <input type="hidden" name="slug" value={slug} />

          <div className="space-y-2">
            <Label htmlFor="authorName">Your Name</Label>
            <Input id="authorName" name="authorName" placeholder="e.g. John Doe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commentText">Feedback</Label>
            <Textarea
              id="commentText"
              name="commentText"
              placeholder="Describe what needs to be changed..."
              rows={3}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            style={{ backgroundColor: 'var(--brand-color)' }}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Submit Feedback
          </Button>
        </form>
      </div>
    </BottomSheet>
  )
}
