'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type AuthActionState = {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
}

export async function loginAction(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validation = LoginSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(validation.data)

  if (error) {
    return { success: false, message: 'Invalid email or password. Please try again.' }
  }

  const redirectTo = formData.get('redirect_to') as string || '/dashboard'
  redirect(redirectTo)
}
