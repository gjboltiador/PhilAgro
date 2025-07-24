"use client"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function ProductionChart() {
  const data = [
    {
      name: "Jan",
      production: 4000,
      target: 4400,
    },
    {
      name: "Feb",
      production: 3500,
      target: 4200,
    },
    {
      name: "Mar",
      production: 4200,
      target: 4000,
    },
    {
      name: "Apr",
      production: 5000,
      target: 4800,
    },
    {
      name: "May",
      production: 4800,
      target: 5000,
    },
    {
      name: "Jun",
      production: 5500,
      target: 5200,
    },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#374151" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#374151" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              color: "#374151",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend 
            wrapperStyle={{
              fontSize: "12px",
              color: "#374151",
            }}
          />
          <Line
            type="monotone"
            dataKey="production"
            name="Actual Production"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ 
              fill: "#22c55e", 
              strokeWidth: 1, 
              r: 3,
              stroke: "#ffffff"
            }}
            activeDot={{ 
              r: 4, 
              fill: "#16a34a",
              stroke: "#ffffff",
              strokeWidth: 2
            }}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target Production"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ 
              fill: "#f97316", 
              strokeWidth: 1, 
              r: 3,
              stroke: "#ffffff"
            }}
            activeDot={{ 
              r: 4, 
              fill: "#ea580c",
              stroke: "#ffffff",
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
