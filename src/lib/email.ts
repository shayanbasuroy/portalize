// Best-effort email notifications via the Resend HTTP API.
//
// Emails are opt-in: without RESEND_API_KEY every send is skipped and logged,
// so the portal works fully for a freelancer who hasn't configured email yet.

import { createAdminClient } from '@/lib/supabase/admin'
import { portalUrl } from '@/lib/urls'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.RESEND_FROM_EMAIL || 'Portalize <onboarding@resend.dev>'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log(`[email] skipped (no RESEND_API_KEY): "${subject}" → ${to}`)
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
    if (!res.ok) {
      console.error('[email] Resend error', res.status, await res.text())
    }
  } catch (err) {
    console.error('[email] send failed', err)
  }
}

interface ProjectContext {
  title: string
  slug: string
  email: string
}

// Resolve the owning freelancer's email + project info. Requires the service
// role key (email lives in auth.users, not exposed to anon RLS).
async function getProjectContext(projectId: string): Promise<ProjectContext | null> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  try {
    const admin = createAdminClient()
    const { data: project } = await admin
      .from('projects')
      .select('title, slug, freelancer_id')
      .eq('id', projectId)
      .single()

    if (!project) return null

    const { data: authUser } = await admin.auth.admin.getUserById(project.freelancer_id)
    const email = authUser?.user?.email
    if (!email) return null

    return { title: project.title, slug: project.slug, email }
  } catch (err) {
    console.error('[email] failed to resolve project context', err)
    return null
  }
}

export async function sendChangeRequestNotification(
  projectId: string,
  deliverableTitle: string,
  authorName: string,
  commentText: string
): Promise<void> {
  const ctx = await getProjectContext(projectId)
  if (!ctx) return
  await sendEmail({
    to: ctx.email,
    subject: `✏️ Change requested on "${ctx.title}"`,
    html: `
      <h2>${ctx.title}</h2>
      <p><strong>${escapeHtml(authorName)}</strong> requested changes on
        <strong>${escapeHtml(deliverableTitle)}</strong>.</p>
      <blockquote style="border-left:3px solid #ddd;padding-left:12px;color:#555">${escapeHtml(commentText)}</blockquote>
      <p><a href="${portalUrl(ctx.slug)}">Open client portal</a></p>
    `,
  })
}

export async function sendApprovalNotification(
  projectId: string,
  deliverableTitle: string | null
): Promise<void> {
  const ctx = await getProjectContext(projectId)
  if (!ctx) return
  const subject = deliverableTitle
    ? `✅ Approved: ${deliverableTitle} (${ctx.title})`
    : `✅ Project approved: ${ctx.title}`
  const body = deliverableTitle
    ? `<p>The client approved <strong>${escapeHtml(deliverableTitle)}</strong>.</p>`
    : `<p>The client approved the entire project.</p>`
  await sendEmail({
    to: ctx.email,
    subject,
    html: `<h2>${ctx.title}</h2>${body}<p><a href="${portalUrl(ctx.slug)}">Open client portal</a></p>`,
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
