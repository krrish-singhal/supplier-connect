"use client"

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onFilterClick?: () => void
  placeholder?: string
  showFilter?: boolean
  className?: string
}

export function SearchBar({ 
  value, 
  onChange, 
  onFilterClick,
  placeholder = "Search suppliers...",
  showFilter = false,
  className 
}: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 pl-10 pr-10 bg-card border-border"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showFilter && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFilterClick}
          className="h-11 w-11 shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
