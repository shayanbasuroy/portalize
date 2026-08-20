'use client'

import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PinInputProps {
  length?: number
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function PinInput({ length = 4, value = '', onChange, disabled = false, className }: PinInputProps) {
  const [pin, setPin] = useState<string[]>(value.split('').slice(0, length).concat(Array(Math.max(0, length - value.length)).fill('')))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, val: string) => {
    if (disabled) return
    const newVal = val.replace(/[^0-9]/g, '')
    if (!newVal && val) return // Ignore non-numeric input

    const newPin = [...pin]
    newPin[index] = newVal.slice(-1) // Take only the last character if multiple are entered
    setPin(newPin)
    onChange(newPin.join(''))

    // Auto-focus next input
    if (newVal && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        // If current is empty, focus previous and clear it
        const newPin = [...pin]
        newPin[index - 1] = ''
        setPin(newPin)
        onChange(newPin.join(''))
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current
        const newPin = [...pin]
        newPin[index] = ''
        setPin(newPin)
        onChange(newPin.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length)
    
    if (pastedData) {
      const newPin = [...pin]
      for (let i = 0; i < pastedData.length; i++) {
        if (i < length) {
          newPin[i] = pastedData[i]
        }
      }
      setPin(newPin)
      onChange(newPin.join(''))
      
      const nextFocusIndex = Math.min(pastedData.length, length - 1)
      inputRefs.current[nextFocusIndex]?.focus()
    }
  }

  return (
    <div className={cn("flex items-center justify-center gap-2 sm:gap-4", className)}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={pin[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-14 sm:w-16 sm:h-20 text-2xl sm:text-4xl text-center flex-shrink-0"
        />
      ))}
    </div>
  )
}
