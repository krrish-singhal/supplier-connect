"use client"

import Link from "next/link"
import { MapPin, Star, BadgeCheck, ChevronRight, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Supplier } from "@/lib/types"

interface SupplierCardProps {
  supplier: Supplier
  className?: string
}

export function SupplierCard({ supplier, className }: SupplierCardProps) {
  return (
    <Link href={`/suppliers/${supplier.id}`}>
      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-md active:scale-[0.98]",
        className
      )}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent">
              {supplier.logo ? (
                <img 
                  src={supplier.logo} 
                  alt={supplier.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
              {supplier.verified && (
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <BadgeCheck className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-foreground">
                    {supplier.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{supplier.city}, {supplier.state}</span>
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </div>

              {/* Rating and Categories */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {supplier.rating && (
                  <div className="flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    <span className="text-xs font-medium text-foreground">{supplier.rating.toFixed(1)}</span>
                  </div>
                )}
                <Badge variant="secondary" className="text-xs font-normal">
                  {supplier.category}
                </Badge>
                {supplier.subcategories.slice(0, 1).map((sub) => (
                  <Badge key={sub} variant="outline" className="text-xs font-normal">
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
