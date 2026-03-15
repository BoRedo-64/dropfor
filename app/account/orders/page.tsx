import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getDailyOrders } from "@/lib/orders"
import { OrdersChart } from "@/components/orders-chart"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const orders = await getDailyOrders()

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">
            Daily order statistics
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders History</CardTitle>
            <CardDescription>
              Your daily order performance
            </CardDescription>
          </CardHeader>

          <CardContent>
          {orders.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Total</th>
                    <th className="text-left p-3 font-medium">Delivered</th>
                    <th className="text-left p-3 font-medium">Returns</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr key={order.id} className="border-t">

                      <td className="p-3">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>

                      <td className="p-3 font-medium">
                        {order.total}
                      </td>

                      <td className="p-3 text-green-600">
                        {order.delivered}
                      </td>

                      <td className="p-3 text-red-600">
                        {order.returns}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No order history yet
              </p>
            </div>

          )}

          </CardContent>
        </Card>
        <OrdersChart data={orders} />
      </div>
    </div>
  )
}