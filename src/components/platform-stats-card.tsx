"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { fadeIn, scaleIn, slideUp } from "@/lib/animations"
// Colors are now passed as props

interface PlatformStatsCardProps {
  title: string
  value: string
  trend: number
  icon: React.ReactNode
  color: string
}

export function PlatformStatsCard({
  title,
  value,
  trend,
  icon,
  color,
}: PlatformStatsCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all hover:shadow-lg",
      fadeIn()
    )}>
      <div
        className="absolute inset-x-0 bottom-0 h-2 opacity-20"
        style={{ backgroundColor: color }}
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div
            className="rounded-full p-2.5 dark:bg-background/10"
            style={{
              backgroundColor: `${color}15`,
              backdropFilter: "blur(8px)"
            }}
          >
            <div className={cn("h-4 w-4", scaleIn())} style={{ color }}>
              {icon}
            </div>
          </div>
        </div>
        <div className={cn("mt-2 flex items-baseline space-x-3", slideUp())}>
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              trend > 0
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
            )}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
            <svg
              className={cn(
                "ml-1 h-3 w-3",
                trend > 0 ? "rotate-0" : "rotate-180"
              )}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2L18.9 8.9L17.5 10.3L13 5.8V22H11V5.8L6.5 10.3L5.1 8.9L12 2Z"
              />
            </svg>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
