"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

import { getStatusConfig } from "@/lib/status" // 🔥 NEW

type StatusData = {
  name: string // 🔥 this should be RAW status (ex: "livré")
  value: number
}

export function OrdersStatusChart({ data }: { data: StatusData[] }) {
  const total = data.reduce((acc, item) => acc + item.value, 0)

  // 🔥 FIX: use raw status instead of label
  const delivered = data.find((d) => d.name === "livré")?.value || 0

  const deliveryRate = total
    ? ((delivered / total) * 100).toFixed(1)
    : "0"

  const chartData = data.filter((item) => item.value > 0)

  return (
    <div className="flex items-center justify-between gap-6 w-full h-[300px]">

      {/* Chart */}
      <div className="w-[50%] h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={chartData.length > 1 ? 2 : 0}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry) => {
                const config = getStatusConfig(entry.name)

                return (
                  <Cell
                    key={entry.name}
                    fill={getColorFromClass(config.className)} // 🔥 convert tailwind → hex
                  />
                )
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + KPI */}
      <div className="w-[50%] flex flex-col justify-center gap-3">

        {data.map((item) => {
          const config = getStatusConfig(item.name)

          const percentage = total
            ? ((item.value / total) * 100).toFixed(1)
            : 0

          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full opacity-80"
                  style={{
                    backgroundColor: getColorFromClass(config.className),
                  }}
                />
                <span className="text-muted-foreground">
                  {config.label}
                </span>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <span>{item.value}</span>
                <span className="text-muted-foreground">
                  ({percentage}%)
                </span>
              </div>
            </div>
          )
        })}

        {/* Divider */}
        <div className="pt-2 mt-2 border-t" />

        {/* KPI */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Taux de livraison
          </span>
          <span className="font-semibold text-primary">
            {deliveryRate}%
          </span>
        </div>

        {/* Total */}
        <div className="text-sm text-muted-foreground">
          Total:{" "}
          <span className="font-medium text-foreground">
            {total}
          </span>
        </div>

      </div>

    </div>
  )
}

/**
 * 🔥 Helper: convert tailwind bg-* → real color
 * (simple mapping for now)
 */
function getColorFromClass(className: string) {
  if (className.includes("green")) return "#22c55e"
  if (className.includes("red")) return "#ef4444"
  if (className.includes("blue")) return "#3b82f6"
  if (className.includes("yellow")) return "#eab308"
  if (className.includes("purple")) return "#a855f7"
  if (className.includes("orange")) return "#f97316"
  return "#6b7280" // gray fallback
}
