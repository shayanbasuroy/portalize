'use client'

import React, { useEffect, useRef } from 'react'

export function WatermarkOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderWatermark = () => {
      if (!containerRef.current) return
      
      const canvas = document.createElement('canvas')
      canvas.width = 300
      canvas.height = 150
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'rgba(24, 24, 27, 0.18)'
        ctx.font =
          '600 20px var(--font-sans, Inter, -apple-system, BlinkMacSystemFont, sans-serif)'
        ctx.translate(150, 75)
        ctx.rotate(-25 * (Math.PI / 180))
        ctx.textAlign = 'center'
        ctx.fillText('PREVIEW ONLY — UNPAID', 0, 0)
      }
      
      containerRef.current.style.backgroundImage = `url(${canvas.toDataURL()})`
    }

    renderWatermark()

    // MutationObserver to prevent removal via DevTools
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          renderWatermark()
        }
      })
    })

    if (containerRef.current) {
      observer.observe(containerRef.current, { attributes: true })
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-50 pointer-events-none select-none"
      style={{ backgroundRepeat: 'repeat' }}
      aria-hidden="true"
    />
  )
}
