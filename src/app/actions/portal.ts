'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies, headers } from 'next/headers'
import { verifyPin } from '@/lib/security'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { isRateLimited, recordFailure, clearFailures } from '@/lib/rate-limit'
import {
  sendChangeRequestNotification,
  sendApprovalNotification,
} from '@/lib/email'

export type PortalActionState = {
  success?: boolean
  message?: string
}

// Best-effort client IP for rate limiting. Trusted on single-region deploys;
// swap for a proper client-IP resolver behind an untrusted proxy/CDN.
async function getClientIp(): Promise<string> {
  const h = await headers()
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  )
}

// Validate the HTTP-only portal session cookie. Client mutations are guarded by
// this so a direct POST without a verified PIN session is a no-op.
async function verifyPortalSession(slug: string): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(`client_session_${slug}`)?.value === 'verified'
}

type ActivityEvent =
  | 'project_opened'
  | 'changes_requested'
  | 'deliverable_approved'
  | 'project_approved'

// Record a read-receipt / activity event. Uses the service role so anon portal
// visitors can write without an open UPDATE grant on projects.
async function logActivity(
  projectId: string,
  eventType: ActivityEvent,
  detail?: string,
  deliverableId?: string
): Promise<void> {
  try {
    const admin = createAdminClient()
    await admin.from('activity_events').insert({
      project_id: projectId,
      deliverable_id: deliverableId ?? null,
      event_type: eventType,
      detail: detail ?? null,
    })
  } catch (err) {
    console.error('[activity] log failed', err)
  }
}

// Verify PIN and set session cookie
export async function verifyPinAction(
  prevState: PortalActionState | null,
  formData: FormData
): Promise<PortalActionState> {
  const slug = formData.get('slug') as string
  const pin = formData.get('pin') as string

  if (!slug || !pin || pin.length < 4) {
    return { success: false, message: 'Please enter a valid 4-digit PIN.' }
  }

  // PRD §6.2 — brute-force protection: max 5 failed attempts/min per IP+slug.
  const ip = await getClientIp()
  const rateKey = `${slug}:${ip}`
  if (isRateLimited(rateKey)) {
    return {
      success: false,
      message: 'Too many incorrect attempts. Please wait a minute and try again.',
    }
  }

  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, access_pin')
    .eq('slug', slug)
    .single()

  if (error || !project) {
    return { success: false, message: 'Project not found.' }
  }

  const isValid = await verifyPin(pin, project.access_pin)
  if (!isValid) {
    recordFailure(rateKey)
    return { success: false, message: 'Invalid PIN. Please try again.' }
  }

  clearFailures(rateKey)

  // Set HTTP-only session cookie
  const cookieStore = await cookies()
  cookieStore.set(`client_session_${slug}`, 'verified', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })

  await logActivity(project.id, 'project_opened', 'Client opened the portal')

  redirect(`/p/${slug}`)
}

// Submit feedback / request changes
export async function submitFeedbackAction(
  prevState: PortalActionState | null,
  formData: FormData
): Promise<PortalActionState> {
  const deliverableId = formData.get('deliverableId') as string
  const authorName = formData.get('authorName') as string
  const commentText = formData.get('commentText') as string
  const slug = formData.get('slug') as string

  if (!deliverableId || !authorName || !commentText) {
    return { success: false, message: 'All fields are required.' }
  }

  if (!(await verifyPortalSession(slug))) {
    return { success: false, message: 'Session expired. Please re-enter your PIN.' }
  }

  // Service role: the client is anonymous, so RLS would block the project
  // status update otherwise.
  const admin = createAdminClient()

  const { error: commentError } = await admin
    .from('feedback_comments')
    .insert({
      deliverable_id: deliverableId,
      sender_role: 'client',
      author_name: authorName,
      comment_text: commentText,
    })

  if (commentError) {
    return { success: false, message: 'Failed to submit feedback.' }
  }

  const { data: deliverable } = await admin
    .from('deliverables')
    .select('project_id, title')
    .eq('id', deliverableId)
    .single()

  await admin
    .from('deliverables')
    .update({ status: 'changes_requested' })
    .eq('id', deliverableId)

  if (deliverable) {
    await admin
      .from('projects')
      .update({ project_status: 'changes_requested' })
      .eq('id', deliverable.project_id)

    await logActivity(
      deliverable.project_id,
      'changes_requested',
      `${authorName} requested changes on ${deliverable.title}`,
      deliverableId
    )

    // Notify the freelancer (opt-in via RESEND_API_KEY).
    await sendChangeRequestNotification(
      deliverable.project_id,
      deliverable.title,
      authorName,
      commentText
    )
  }

  revalidatePath(`/p/${slug}`)
  return { success: true, message: 'Feedback submitted successfully.' }
}

// Approve a single deliverable
export async function approveDeliverableAction(
  formData: FormData
): Promise<void> {
  const deliverableId = formData.get('deliverableId') as string
  const slug = formData.get('slug') as string

  if (!(await verifyPortalSession(slug))) return

  const admin = createAdminClient()

  const { data: deliverable } = await admin
    .from('deliverables')
    .select('project_id, title')
    .eq('id', deliverableId)
    .single()

  await admin
    .from('deliverables')
    .update({ status: 'approved' })
    .eq('id', deliverableId)

  if (deliverable) {
    await logActivity(
      deliverable.project_id,
      'deliverable_approved',
      `Client approved ${deliverable.title}`,
      deliverableId
    )
    await sendApprovalNotification(deliverable.project_id, deliverable.title)
  }

  revalidatePath(`/p/${slug}`)
}

// Approve entire project
export async function approveProjectAction(
  formData: FormData
): Promise<void> {
  const projectId = formData.get('projectId') as string
  const slug = formData.get('slug') as string

  if (!(await verifyPortalSession(slug))) return

  const admin = createAdminClient()

  await admin
    .from('deliverables')
    .update({ status: 'approved' })
    .eq('project_id', projectId)

  await admin
    .from('projects')
    .update({ project_status: 'approved' })
    .eq('id', projectId)

  await logActivity(projectId, 'project_approved', 'Client approved the project')
  await sendApprovalNotification(projectId, null)

  revalidatePath(`/p/${slug}`)
}
