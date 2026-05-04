"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center rounded-xl bg-primary", sizes[size], size === "sm" ? "w-6" : size === "md" ? "w-8" : "w-10")}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cn("text-primary-foreground", size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6")}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
          <path d="M12 3h9v18h-9z" />
          <path d="M15 8h3" />
          <path d="M15 12h3" />
          <path d="M15 16h3" />
        </svg>
      </div>
      <span className={cn(
        "font-semibold text-foreground tracking-tight",
        size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl"
      )}>
        SupplierConnect
      </span>
    </div>
  )
}
