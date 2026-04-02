"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function PickupsTable({ pickups }: { pickups: any[] }) {
  const router = useRouter()

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm">

        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">Pickup</th>
            <th className="p-3 text-left">Orders</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {pickups.map((pickup) => {
            const orderCount = pickup.orders?.length || 0

            const statusStyle =
              pickup.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : pickup.status === "accepted"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"

            return (
              <tr
                key={pickup.id}
                className="border-t cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/account/pickups/${pickup.id}`)}
              >
                <td className="p-3 font-medium">
                  #{pickup.id.slice(0, 8)}
                </td>

                <td className="p-3">
                  {orderCount} orders
                </td>

                <td className="p-3">
                  <Badge className={statusStyle}>
                    {pickup.status}
                  </Badge>
                </td>

                <td className="p-3">
                  {new Date(pickup.created_at).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            )
          })}
        </tbody>

      </table>
    </div>
  )
}
