'use client'

import { useActionState } from 'react'
import { forgotPasswordAction } from '@/app/actions/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null)

  return (
    <div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Reset your password
        </h1>
        <p className="text-sm text-zinc-500">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-5">
        {state?.message && (
          <div
            role="alert"
            className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${
              state.success
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
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
        </div>

        <Button type="submit" className="h-11 w-full text-base" disabled={isPending}>
          {isPending ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link
          href="/login"
          className="font-medium text-zinc-900 underline-offset-4 hover:underline"
        >
          Back to login
        </Link>
      </p>
    </div>
  )
}
