"use client";

// Lightweight haptic feedback via the Vibration API (mobile). A no-op on
// desktop and wherever the API is unavailable. Reserved for meaningful commit
// moments — unlocking a download, approving work — never for routine taps.
export function vibrate(pattern: number | number[] = 15): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
