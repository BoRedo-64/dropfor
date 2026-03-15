"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrderData {
  created_at: string
  total: number
  returns: number
}

export function OrdersChart({ data }: { data: OrderData[] }) {
  const [mode, setMode] = useState<"day" | "month">("day")

  function groupData() {
    const map: Record<string, { total: number; returns: number }> = {}

    data.forEach((row) => {
      const date = new Date(row.created_at)

      const key =
        mode === "day"
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : `${date.getFullYear()}-${date.getMonth() + 1}`

      if (!map[key]) {
        map[key] = { total: 0, returns: 0 }
      }

      map[key].total += row.total
      map[key].returns += row.returns
    })

    return Object.entries(map).map(([date, values]) => ({
      date,
      total: values.total,
      returns: values.returns,
    }))
  }

  const chartData = groupData()

  return (
    <div className="mt-10">

      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Orders Analytics</h2>

        <Select
          defaultValue="day"
          onValueChange={(v) => setMode(v as "day" | "month")}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="day">By Day</SelectItem>
            <SelectItem value="month">By Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* chart */}
      <div className="h-[320px] w-full">

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="20%"
          >

            {/* background grid */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            {/* numbers on the left */}
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
            />

            {/* days */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip />

            {/* total orders */}
            <Bar
              dataKey="total"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              barSize={40}
              maxBarSize={45}
            />

            {/* returns overlay */}
            <Bar
              dataKey="returns"
              fill="#9ca3af"
              radius={[6, 6, 0, 0]}
              barSize={40}
              maxBarSize={45}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  )
}