"use client"

import Link from "next/link"
import { MapPin, Calendar, IndianRupee, ChevronRight, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Opportunity } from "@/lib/types"

interface OpportunityCardProps {
  opportunity: Opportunity
  className?: string
}

function getStatusColor(status: Opportunity["status"]) {
  switch (status) {
    case "open":
      return "bg-success/10 text-success border-success/20"
    case "closed":
      return "bg-muted text-muted-foreground border-muted"
    case "in_progress":
      return "bg-warning/10 text-warning border-warning/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN", { 
    day: "numeric", 
    month: "short" 
  })
}

function getDaysLeft(deadline: string) {
  const now = new Date()
  const end = new Date(deadline)
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export function OpportunityCard({ opportunity, className }: OpportunityCardProps) {
  const daysLeft = getDaysLeft(opportunity.deadline)
  const isUrgent = daysLeft <= 3 && daysLeft > 0

  return (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-md active:scale-[0.98]",
        className
      )}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Status and Category */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn("text-xs font-medium capitalize", getStatusColor(opportunity.status))}>
                  {opportunity.status.replace("_", " ")}
                </Badge>
                <Badge variant="secondary" className="text-xs font-normal">
                  {opportunity.category}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="mt-2 font-semibold leading-snug text-foreground">
                {opportunity.title}
              </h3>

              {/* Description */}
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {opportunity.description}
              </p>

              {/* Meta Info */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  <span>{opportunity.budget}</span>
                </div>
                <div className={cn(
                  "flex items-center gap-1",
                  isUrgent && "text-destructive font-medium"
                )}>
                  {isUrgent ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <Calendar className="h-3.5 w-3.5" />
                  )}
                  <span>
                    {daysLeft > 0 
                      ? `${daysLeft} days left` 
                      : daysLeft === 0 
                        ? "Last day" 
                        : "Expired"
                    }
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className="mt-6 h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
