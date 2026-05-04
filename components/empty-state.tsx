"use client"

import { LucideIcon, SearchX, Package, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function EmptyState({ 
  icon: Icon = Inbox, 
  title, 
  description,
  className,
  children
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center px-6 py-12 text-center",
      className
    )}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={SearchX}
      title="No results found"
      description={`We couldn't find any matches for "${query}". Try a different search term.`}
    />
  )
}

export function NoSuppliers() {
  return (
    <EmptyState
      icon={Package}
      title="No suppliers found"
      description="No suppliers available in this region yet. Check back soon or try another region."
    />
  )
}
