"use client"

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OtpInput({ 
  length = 6, 
  value, 
  onChange, 
  disabled = false,
  className 
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [disabled])

  const handleChange = (index: number, inputValue: string) => {
    const digit = inputValue.slice(-1)
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split("")
    newValue[index] = digit
    const result = newValue.join("").slice(0, length)
    onChange(result)

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        setActiveIndex(index - 1)
        const newValue = value.split("")
        newValue[index - 1] = ""
        onChange(newValue.join(""))
      } else {
        const newValue = value.split("")
        newValue[index] = ""
        onChange(newValue.join(""))
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setActiveIndex(index - 1)
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    onChange(pastedData)
    const lastIndex = Math.min(pastedData.length, length) - 1
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus()
      setActiveIndex(lastIndex)
    }
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          disabled={disabled}
          className={cn(
            "h-12 w-10 rounded-lg border-2 bg-background text-center text-lg font-semibold text-foreground transition-all",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            activeIndex === index && !disabled 
              ? "border-primary" 
              : "border-input",
            value[index] && "border-primary/50"
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
