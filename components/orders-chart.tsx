"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function OrdersBarChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          {/* total orders */}
          <Bar dataKey="total" radius={[4, 4, 0, 0]} />

          {/* returns overlay */}
          <Bar dataKey="returns" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}