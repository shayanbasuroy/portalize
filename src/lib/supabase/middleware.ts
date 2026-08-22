import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // `getSession()` decodes the JWT locally — no network round-trip — which is
  // all the proxy needs to gate `/dashboard` and redirect logged-in users off
  // `/login`/`/signup`. Full validation + token refresh happens in the page via
  // `getUser()` (see `getCurrentUser`), so an expired token still redirects.
  const { data: { session } } = await supabase.auth.getSession()
  return { response, user: session?.user ?? null }
}
