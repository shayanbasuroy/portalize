'use client'

import { Suspense, useActionState, useState } from 'react'
import { loginAction } from './actions'
import { magicLinkAction } from '@/app/actions/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">
            Enter your details to access your dashboard.
          </p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [pwState, pwAction, pwPending] = useActionState(loginAction, null)
  const [magicState, magicAction, magicPending] = useActionState(magicLinkAction, null)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect_to') || ''

  const state = mode === 'password' ? pwState : magicState
  const errors = mode === 'password' ? pwState?.errors : undefined
  const isPending = mode === 'password' ? pwPending : magicPending
  const formAction = mode === 'password' ? pwAction : magicAction

  return (
    <div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {mode === 'password' ? 'Welcome back' : 'Email me a magic link'}
        </h1>
        <p className="text-sm text-zinc-500">
          {mode === 'password'
            ? 'Enter your details to access your dashboard.'
            : "We'll email you a link that signs you in — no password."}
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="redirect_to" value={redirectTo} />

        {state?.message && (
          <div
            role="alert"
            className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${
              state.success
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {state.success ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{state.message}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            autoComplete="email"
            className="h-11 rounded-lg px-3.5"
          />
          {errors?.email && (
            <p className="text-xs text-red-600">{errors.email[0]}</p>
          )}
        </div>

        {mode === 'password' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="h-11 rounded-lg px-3.5"
            />
            {errors?.password && (
              <p className="text-xs text-red-600">{errors.password[0]}</p>
            )}
          </div>
        )}

        <Button type="submit" className="h-11 w-full text-base" disabled={isPending}>
          {isPending
            ? mode === 'password'
              ? 'Logging in…'
              : 'Sending…'
            : mode === 'password'
              ? 'Login'
              : 'Send magic link'}
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm text-zinc-500">
        {mode === 'password' ? (
          <button
            type="button"
            onClick={() => setMode('magic')}
            className="font-medium text-zinc-900 underline-offset-4 hover:underline"
          >
            Email me a magic link instead
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMode('password')}
            className="font-medium text-zinc-900 underline-offset-4 hover:underline"
          >
            Back to password login
          </button>
        )}
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
