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
  // HMAC-signed token only after a successful PIN check. Gate the portal view
  // (`/p/[slug]`) but not the PIN-entry page (`/p/[slug]/auth`).
  if (pathname.startsWith('/p/')) {
    const slug = pathname.split('/')[2]
    if (slug && !pathname.endsWith('/auth')) {
      const sessionCookie = request.cookies.get(`client_session_${slug}`)
      if (!sessionCookie || !(await verifyPortalSessionToken(slug, sessionCookie.value))) {
        return NextResponse.redirect(new URL(`/p/${slug}/auth`, request.url))
      }
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Only run on routes that actually need auth handling. Every other request
// (marketing landing page, assets, API, OAuth callback) skips the proxy so it
// never pays for an unnecessary `supabase.auth.getUser()` round-trip.
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/p/:path*'],
}
