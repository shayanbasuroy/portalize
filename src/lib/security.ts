import { nanoid } from 'nanoid'

// Hash PIN using SHA-256 via Web Crypto API
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Verify PIN against stored hash
export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  const hash = await hashPin(pin)
  return hash === storedHash
}

// Generate random 4-digit PIN
export function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Generate URL-safe slug from title with unique suffix
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  const suffix = nanoid(6)
  return `${base}-${suffix}`
}
