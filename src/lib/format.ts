// Minimal relative-time formatter (replaces date-fns `formatDistanceToNow`
// for the small set of cases the portal uses).

export function formatRelativeTime(date: Date | string, now: Date = new Date()): string {
  const input = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - input.getTime()
  const absSec = Math.floor(Math.abs(diffMs) / 1000)

  const suffix = diffMs >= 0 ? 'ago' : 'from now'

  const format = (value: number, unit: string) => `${value} ${unit}${value === 1 ? '' : 's'} ${suffix}`

  if (absSec < 60) return 'just now'
  const absMin = Math.floor(absSec / 60)
  if (absMin < 60) return format(absMin, 'minute')
  const absHr = Math.floor(absMin / 60)
  if (absHr < 24) return format(absHr, 'hour')
  const absDay = Math.floor(absHr / 24)
  if (absDay < 7) return format(absDay, 'day')
  const absWeek = Math.floor(absDay / 7)
  if (absWeek < 5) return format(absWeek, 'week')
  const absMonth = Math.floor(absDay / 30)
  if (absMonth < 12) return format(absMonth, 'month')
  const absYear = Math.floor(absDay / 365)
  return format(absYear, 'year')
}
