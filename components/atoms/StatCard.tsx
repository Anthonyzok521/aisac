import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, trendValue, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      {trend && trendValue && (
        <div className="mt-4 flex items-center">
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" && "text-green-500",
              trend === "down" && "text-red-500",
              trend === "neutral" && "text-muted-foreground",
            )}
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}
