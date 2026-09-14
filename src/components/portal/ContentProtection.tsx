'use client'

import React, { useCallback, useEffect, useState } from 'react'

interface ContentProtectionProps {
  children: React.ReactNode
  /** When true (paid), most protections are relaxed */
  isPaid: boolean
}

/**
 * Wraps portal content with anti-screenshot and anti-copy protections.
 *
 * What it does:
 * 1. Intercepts known screenshot keyboard shortcuts and blurs content
 *    - Mac: Cmd+Shift+3/4/5 (system screenshots)
 *    - Windows: PrintScreen, Win+PrintScreen, Win+Shift+S
 * 2. Blocks right-click context menu on the portal (no "Save Image As")
 * 3. Blocks Cmd/Ctrl+S (Save Page) and Cmd/Ctrl+P (Print)
 * 4. Disables drag-and-drop on images
 * 5. Disables text selection when unpaid
 * 6. Blurs content when tab loses visibility (some screenshot tools trigger this)
 * 7. CSS @media print hides everything (added in globals.css)
 *
 * Limitations: This is deterrent-level, not DRM-level. A determined user
 * can still photograph the screen or use DevTools. The goal is to make it
 * inconvenient enough that the typical non-technical client won't bother.
 */
export function ContentProtection({ children, isPaid }: ContentProtectionProps) {
  const [isBlurred, setIsBlurred] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const triggerProtection = useCallback(() => {
    setIsBlurred(true)
    setShowWarning(true)

    // Unblur after a short delay — long enough that the screenshot captures
    // the blurred/white state, short enough to not be annoying.
    setTimeout(() => {
      setIsBlurred(false)
    }, 1200)

    setTimeout(() => {
      setShowWarning(false)
    }, 2500)
  }, [])

  useEffect(() => {
    // --- Screenshot keyboard shortcut interception ---
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')

      // Mac: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
      if (isMac && e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault()
        triggerProtection()
        return
      }

      // Windows: PrintScreen (with or without modifiers)
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        triggerProtection()
        return
      }

      // Windows: Win+Shift+S (Snipping Tool) — the 'S' with Meta+Shift
      if (!isMac && e.metaKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        triggerProtection()
        return
      }

      // Block Cmd/Ctrl+S (Save Page)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        return
      }

      // Block Cmd/Ctrl+P (Print)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        return
      }

      // Block Cmd/Ctrl+Shift+I (DevTools) — mild deterrent
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        if (!isPaid) {
          e.preventDefault()
          return
        }
      }
    }

    // --- Visibility change: blur when tab is hidden ---
    const handleVisibilityChange = () => {
      if (document.hidden && !isPaid) {
        setIsBlurred(true)
      } else {
        // Small delay before unblurring so a fast tab-switch screenshot
        // still catches the blur
        setTimeout(() => setIsBlurred(false), 300)
      }
    }

    // --- Block right-click ---
    const handleContextMenu = (e: MouseEvent) => {
      if (!isPaid) {
        e.preventDefault()
      }
    }

    // --- Block drag (prevents dragging images to desktop) ---
    const handleDragStart = (e: DragEvent) => {
      if (!isPaid) {
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('dragstart', handleDragStart)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [isPaid, triggerProtection])

  return (
    <div
      data-portal-protected={!isPaid || undefined}
      className={`relative transition-all duration-200 ${
        !isPaid ? 'select-none' : ''
      }`}
      style={{
        filter: isBlurred ? 'blur(30px) brightness(1.3)' : 'none',
        transition: 'filter 0.15s ease-out',
      }}
      onCopy={(e) => {
        if (!isPaid) e.preventDefault()
      }}
      onCut={(e) => {
        if (!isPaid) e.preventDefault()
      }}
    >
      {children}

      {/* Screenshot attempt warning toast */}
      {showWarning && (
        <div
          className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 animate-fade-up"
          role="alert"
        >
          <div className="flex items-center gap-2.5 border border-zinc-200 bg-white px-5 py-3 shadow-lg">
            <span className="flex size-5 items-center justify-center border border-zinc-300 text-zinc-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <p className="font-mono text-[12px] text-[#151B45]">
              Content is protected — screenshots are disabled
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
