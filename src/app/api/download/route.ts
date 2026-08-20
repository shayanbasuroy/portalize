import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const deliverableId = searchParams.get('deliverableId')
  const slug = searchParams.get('slug')

  if (!deliverableId || !slug) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  // Verify client session cookie
  const sessionCookie = request.cookies.get(`client_session_${slug}`)
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Use service role key to bypass RLS for admin operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch deliverable with project info
  const { data: deliverable, error } = await supabase
    .from('deliverables')
    .select('*, projects!inner(payment_status, slug)')
    .eq('id', deliverableId)
    .single()

  if (error || !deliverable) {
    return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })
  }

  // Verify slug matches
  if (deliverable.projects.slug !== slug) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Check payment status
  if (deliverable.projects.payment_status !== 'paid') {
    return NextResponse.json(
      { error: 'Payment Required: Complete invoice payment to unlock downloads.' },
      { status: 402 }
    )
  }

  // Generate signed download URL (5 min expiry)
  const { data: signedUrlData, error: storageError } = await supabase.storage
    .from('deliverables-bucket')
    .createSignedUrl(deliverable.content_url, 300, { download: true })

  if (storageError || !signedUrlData) {
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 })
  }

  return NextResponse.redirect(signedUrlData.signedUrl)
}
