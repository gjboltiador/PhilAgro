"use client"

import { TrendingDown, TrendingUp, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SugarPricesWidget() {
  const priceData = [
    {
      grade: "Raw Sugar",
      currentPrice: "₱2,850",
      previousPrice: "₱2,780",
      change: "+2.5%",
      trend: "up",
      lastUpdated: "Jul 12, 2024",
      icon: "🌾",
    },
    {
      grade: "Refined Sugar",
      currentPrice: "₱3,200",
      previousPrice: "₱3,150",
      change: "+1.6%",
      trend: "up",
      lastUpdated: "Jul 12, 2024",
      icon: "🍯",
    },
    {
      grade: "Brown Sugar",
      currentPrice: "₱2,950",
      previousPrice: "₱3,000",
      change: "-1.7%",
      trend: "down",
      lastUpdated: "Jul 12, 2024",
      icon: "🟤",
    },
  ]

  return (
    <div className="space-y-4">
      {priceData.map((item) => (
        <div
          key={item.grade}
          className="flex items-center justify-between rounded-xl border border-farm-green-200 bg-gradient-to-r from-white to-farm-green-50 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-farm-green-100 text-xl">
              {item.icon}
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-farm-green-800">{item.grade}</p>
              <p className="text-sm text-farm-green-600">Updated: {item.lastUpdated}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-farm-green-600" />
              <p className="text-xl font-bold text-farm-green-800">{item.currentPrice}</p>
            </div>
            <div className="flex items-center justify-end gap-1 mt-1">
              {item.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-farm-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <Badge
                variant={item.trend === "up" ? "default" : "destructive"}
                className={`text-xs ${item.trend === "up" ? "bg-farm-green-600 hover:bg-farm-green-700" : ""}`}
              >
                {item.change}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
