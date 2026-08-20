import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Generic payment webhook: mark a project as paid once an invoice clears
// (bank transfer, Stripe, Razorpay, cash). For production, plug in your
// provider's signature verification (e.g. Stripe's constructEvent) instead of
// a shared secret, then call the same update.
export async function POST(request: NextRequest) {
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'Webhook not configured (set WEBHOOK_SECRET)' },
      { status: 503 }
    )
  }

  const auth = request.headers.get('x-webhook-secret')
  if (!auth || auth !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { projectId?: string } = {}
  try {
    body = (await request.json()) as { projectId?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const projectId = body.projectId
  if (!projectId) {
    return NextResponse.json(
      { error: 'Missing projectId in body' },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('projects')
    .update({ payment_status: 'paid' })
    .eq('id', projectId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
