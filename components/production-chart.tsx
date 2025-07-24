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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
          <XAxis dataKey="name" stroke="#166534" />
          <YAxis stroke="#166534" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              color: "#166534",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="production"
            name="Actual Production"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: "#22c55e", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: "#16a34a" }}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target Production"
            stroke="#f97316"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: "#f97316", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: "#ea580c" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
