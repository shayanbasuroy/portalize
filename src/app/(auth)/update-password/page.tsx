'use client'

import { useActionState } from 'react'
import { updatePasswordAction } from '@/app/actions/auth'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, null)

  return (
    <div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Choose a new password
        </h1>
        <p className="text-sm text-zinc-500">
          Set a new password for your account.
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
          <Label htmlFor="password" className="text-sm font-medium text-zinc-700">
            New password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 6 characters"
            className="h-11 rounded-lg px-3.5"
          />
        </div>

        <Button type="submit" className="h-11 w-full text-base" disabled={isPending}>
          {isPending ? 'Saving…' : 'Update password'}
        </Button>
      </form>
    </div>
  )
}
