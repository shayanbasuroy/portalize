// Build absolute portal URLs from the configured public app URL.

export function portalUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${base.replace(/\/$/, '')}/p/${slug}`
}
