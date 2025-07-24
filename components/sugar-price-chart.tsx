"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts"

interface SugarPriceChartProps {
  period: string
  grade: string
}

export function SugarPriceChart({ period, grade }: SugarPriceChartProps) {
  // Sample data - in a real app, this would be fetched based on period and grade
  const data = [
    { date: "Jul 1", rawSugar: 2750, refinedSugar: 3100, brownSugar: 3020, muscovado: 3400 },
    { date: "Jul 3", rawSugar: 2760, refinedSugar: 3110, brownSugar: 3010, muscovado: 3410 },
    { date: "Jul 5", rawSugar: 2780, refinedSugar: 3140, brownSugar: 3000, muscovado: 3430 },
    { date: "Jul 7", rawSugar: 2790, refinedSugar: 3150, brownSugar: 2990, muscovado: 3440 },
    { date: "Jul 9", rawSugar: 2800, refinedSugar: 3160, brownSugar: 2980, muscovado: 3450 },
    { date: "Jul 11", rawSugar: 2830, refinedSugar: 3180, brownSugar: 2970, muscovado: 3480 },
    { date: "Jul 12", rawSugar: 2850, refinedSugar: 3200, brownSugar: 2950, muscovado: 3500 },
  ]

  const getVisibleLines = () => {
    if (grade === "raw") return ["rawSugar"]
    if (grade === "refined") return ["refinedSugar"]
    if (grade === "brown") return ["brownSugar"]
    if (grade === "muscovado") return ["muscovado"]
    return ["rawSugar", "refinedSugar", "brownSugar", "muscovado"]
  }

  const visibleLines = getVisibleLines()

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={["dataMin - 50", "dataMax + 50"]} />
          <Tooltip
            formatter={(value: number) => [`₱${value.toLocaleString()}`, ""]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          {visibleLines.includes("rawSugar") && (
            <Line
              type="monotone"
              dataKey="rawSugar"
              stroke="#ef4444"
              strokeWidth={2}
              name="Raw Sugar"
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            />
          )}
          {visibleLines.includes("refinedSugar") && (
            <Line
              type="monotone"
              dataKey="refinedSugar"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Refined Sugar"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
          )}
          {visibleLines.includes("brownSugar") && (
            <Line
              type="monotone"
              dataKey="brownSugar"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Brown Sugar"
              dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            />
          )}
          {visibleLines.includes("muscovado") && (
            <Line
              type="monotone"
              dataKey="muscovado"
              stroke="#10b981"
              strokeWidth={2}
              name="Muscovado"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
