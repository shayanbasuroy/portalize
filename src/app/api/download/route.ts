import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyPortalSessionToken } from '@/lib/session'

// Map a code language to a file extension for code downloads.
const CODE_EXTENSIONS: Record<string, string> = {
  typescript: 'ts',
  javascript: 'js',
  jsx: 'jsx',
  tsx: 'tsx',
  html: 'html',
  css: 'css',
  python: 'py',
  json: 'json',
  sql: 'sql',
  bash: 'sh',
  shell: 'sh',
}

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const deliverableId = searchParams.get('deliverableId')
  const slug = searchParams.get('slug')

  if (!deliverableId || !slug) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  // Verify client session cookie (HMAC-signed token)
  const sessionCookie = request.cookies.get(`client_session_${slug}`)
  if (!sessionCookie || !(await verifyPortalSessionToken(slug, sessionCookie.value))) {
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

  // Code deliverables are stored inline (no storage object), so stream the
  // source as a downloadable file rather than trying to sign a null path.
  if (deliverable.deliverable_type === 'code') {
    const ext = CODE_EXTENSIONS[deliverable.code_language] || 'txt'
    const filename = safeFilename(`${deliverable.title || 'code'}.${ext}`)
    return new NextResponse(deliverable.code_content || '', {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  }

  if (!deliverable.content_url) {
    return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })
  }

  // Generate signed download URL (5 min expiry) with the original filename.
  const { data: signedUrlData, error: storageError } = await supabase.storage
    .from('deliverables-bucket')
    .createSignedUrl(deliverable.content_url, 300, {
      download: safeFilename(deliverable.title || 'download'),
    })

  if (storageError || !signedUrlData) {
    return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 })
  }

  return NextResponse.redirect(signedUrlData.signedUrl)
}
