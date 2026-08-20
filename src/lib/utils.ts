import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Supabase embeds to-one relationships as an object, but without a generated
// Database type it can infer them as arrays. This normalizes either shape.
export function asSingle<T>(value: T | T[] | null | undefined): T | undefined {
  if (Array.isArray(value)) return (value as T[])[0]
  return (value ?? undefined) as T | undefined
}
