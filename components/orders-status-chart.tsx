"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

type StatusData = {
  name: string
  value: number
}

const COLORS = [
  "#22c55e", // Livré
  "#ef4444", // Retour
  "#3b82f6", // En livraison
  "#eab308", // En attente
]

export function OrdersStatusChart({ data }: { data: StatusData[] }) {
  const total = data.reduce((acc, item) => acc + item.value, 0)

  const delivered = data.find((d) => d.name === "Livré")?.value || 0
  const deliveryRate = total
    ? ((delivered / total) * 100).toFixed(1)
    : "0"

  // ✅ FIX: only render non-zero values in chart
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
              paddingAngle={chartData.length > 1 ? 2 : 0} // ✅ fix gap issue
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry) => {
                const index = data.findIndex(d => d.name === entry.name)
                return (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                )
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend + KPI */}
      <div className="w-[50%] flex flex-col justify-center gap-3">

        {data.map((item, index) => {
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
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-muted-foreground">
                  {item.name}
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
