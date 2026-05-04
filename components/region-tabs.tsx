"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { regions } from "@/lib/data"

interface RegionTabsProps {
  selectedRegion: string
  onRegionChange: (region: string) => void
  className?: string
}

export function RegionTabs({ selectedRegion, onRegionChange, className }: RegionTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  useEffect(() => {
    const activeTab = tabRefs.current.get(selectedRegion)
    if (activeTab && scrollRef.current) {
      const container = scrollRef.current
      const tabLeft = activeTab.offsetLeft
      const tabWidth = activeTab.offsetWidth
      const containerWidth = container.offsetWidth
      const scrollLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2)
      
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth"
      })
    }
  }, [selectedRegion])

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {regions.map((region) => (
          <button
            key={region.id}
            ref={(el) => { if (el) tabRefs.current.set(region.id, el) }}
            onClick={() => onRegionChange(region.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
              selectedRegion === region.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {region.name}
          </button>
        ))}
      </div>
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-background to-transparent" />
    </div>
  )
}
