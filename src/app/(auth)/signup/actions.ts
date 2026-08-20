'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { AuthActionState } from '../login/actions'

const SignupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  business_name: z.string().optional(),
})

export async function signupAction(
  prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const rawData = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    business_name: (formData.get('business_name') as string) || undefined,
  }

  const validation = SignupSchema.safeParse(rawData)
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
  })

  if (authError || !authData.user) {
    return { success: false, message: authError?.message || 'Failed to create account.' }
  }

  // Insert freelancer profile
  const { error: profileError } = await supabase
    .from('freelancers')
    .insert({
      id: authData.user.id,
      full_name: validation.data.full_name,
      business_name: validation.data.business_name || null,
    })

  if (profileError) {
    return { success: false, message: 'Account created but profile setup failed. Please contact support.' }
  }

  redirect('/dashboard')
}
