'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export type MessageState = { success?: boolean; message?: string }

function appOrigin(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// Magic-link login (PRD: "Magic Link / Password"). Existing users only — signup
// remains password-based, so we never auto-create an account without a profile.
export async function magicLinkAction(
  _prev: MessageState | null,
  formData: FormData
): Promise<MessageState> {
  const email = String(formData.get('email') || '')
  if (!email) return { success: false, message: 'Enter your email address.' }

  try {
    const supabase = await createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appOrigin()}/auth/callback`,
        shouldCreateUser: false,
      },
    })
  } catch {
    // Anti-enumeration: report the same outcome whether or not the email exists.
  }

  return {
    success: true,
    message: "If an account exists for this email, we've sent you a magic link.",
  }
}

export async function forgotPasswordAction(
  _prev: MessageState | null,
  formData: FormData
): Promise<MessageState> {
  const email = String(formData.get('email') || '')
  if (!email) return { success: false, message: 'Enter your email address.' }

  try {
    const supabase = await createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appOrigin()}/auth/callback?next=/update-password`,
    })
  } catch {
    // Anti-enumeration.
  }

  return {
    success: true,
    message: "If an account exists for this email, we've sent a reset link.",
  }
}

export async function updatePasswordAction(
  _prev: MessageState | null,
  formData: FormData
): Promise<MessageState> {
  const password = String(formData.get('password') || '')
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return {
      success: false,
      message: 'Invalid or expired link. Request a new reset link.',
    }
  }

  redirect('/dashboard')
}
