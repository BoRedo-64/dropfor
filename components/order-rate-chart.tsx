"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface Props {
  delivered: number
  returns: number
}

export function OrderRateChart({ delivered, returns }: Props) {
  const total = delivered + returns

  const data = [
    { name: "Delivered", value: delivered },
    { name: "Returned", value: returns },
  ]

  const COLORS = ["#22c55e", "#ef4444"]

  const deliveredRate = total ? Math.round((delivered / total) * 100) : 0
  const returnRate = total ? Math.round((returns / total) * 100) : 0

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-2 text-sm">
        <span className="text-green-600 font-medium">
          Delivered: {deliveredRate}%
        </span>
        <span className="text-red-500 font-medium">
          Returns: {returnRate}%
        </span>
      </div>
    </div>
  )
}