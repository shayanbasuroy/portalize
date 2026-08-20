'use client'

import { useActionState } from 'react'
import { signupAction } from './actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, null)

  return (
    <div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Create your account
        </h1>
        <p className="text-sm text-zinc-500">
          Start sharing deliverables with your clients in minutes.
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-5">
        {state?.message && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-sm font-medium text-zinc-700">
            Full name
          </Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="Jane Designer"
            required
            autoComplete="name"
            className="h-11 rounded-lg px-3.5"
          />
          {state?.errors?.full_name && (
            <p className="text-xs text-red-600">{state.errors.full_name[0]}</p>
          )}
        </div>

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
          {state?.errors?.email && (
            <p className="text-xs text-red-600">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
            className="h-11 rounded-lg px-3.5"
          />
          {state?.errors?.password && (
            <p className="text-xs text-red-600">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_name" className="text-sm font-medium text-zinc-700">
            Business name <span className="font-normal text-zinc-400">(optional)</span>
          </Label>
          <Input
            id="business_name"
            name="business_name"
            placeholder="Studio North"
            className="h-11 rounded-lg px-3.5"
          />
          {state?.errors?.business_name && (
            <p className="text-xs text-red-600">{state.errors.business_name[0]}</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full text-base" disabled={isPending}>
          {isPending ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-zinc-900 underline-offset-4 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}
