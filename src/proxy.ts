import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { verifyPortalSessionToken } from '@/lib/session'

// Next.js 16 renamed the `middleware` file convention to `proxy`.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Freelancer Auth ---
  if (pathname.startsWith('/dashboard')) {
    const { response, user } = await updateSession(request)
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect_to', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  if (pathname === '/login' || pathname === '/signup') {
    const { response, user } = await updateSession(request)
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // --- Client Portal Auth ---
  // A verified session cookie is HTTP-only, SameSite=strict, and carries an
  // HMAC-signed token only after a successful PIN check.
  const portalMatch = pathname.match(/^\/p\/([^\/]+)$/)
  if (portalMatch) {
    const slug = portalMatch[1]
    const sessionCookie = request.cookies.get(`client_session_${slug}`)
    if (!sessionCookie || !(await verifyPortalSessionToken(slug, sessionCookie.value))) {
      return NextResponse.redirect(new URL(`/p/${slug}/auth`, request.url))
    }
  }

  // For the OAuth callback, skip the session refresh to avoid redirect loops.
  if (pathname.startsWith('/auth/callback')) {
    return NextResponse.next()
  }

  const { response } = await updateSession(request)
  return response
}

export const config = {
  matcher: [
    // Exclude API routes (they handle their own auth), static files, image
    // optimization, and media assets.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'
  ]
}
