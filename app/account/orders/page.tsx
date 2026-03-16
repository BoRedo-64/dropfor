import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

import { OrdersFilters } from "@/components/orders-filters"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    status?: string
    payment?: string
    city?: string
  }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // unwrap params
  const params = await searchParams

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,number.ilike.%${params.search}%`)
  }

  if (params.status) {
    query = query.eq("status", params.status)
  }

  if (params.payment) {
    query = query.eq("payment", params.payment)
  }

  if (params.city) {
    query = query.eq("city", params.city)
  }

  const { data: orders } = await query

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your customer orders
          </p>
        </div>

        {/* Filters */}
        <OrdersFilters filters={params} />

        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
            <CardDescription>
              All orders from your customers
            </CardDescription>
          </CardHeader>

          <CardContent>

            {orders && orders.length > 0 ? (

              <div className="rounded-md border overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Client</th>
                      <th className="text-left p-3 font-medium">Phone</th>
                      <th className="text-left p-3 font-medium">City</th>
                      <th className="text-left p-3 font-medium">Qty</th>
                      <th className="text-left p-3 font-medium">Colis</th>
                      <th className="text-left p-3 font-medium">Total</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Payment</th>
                      <th className="text-left p-3 font-medium">Livreur</th>
                      <th className="text-left p-3 font-medium">Date</th>
                    </tr>
                  </thead>

                  <tbody>

                    {orders.map((order) => (

                      <tr key={order.id} className="border-t">

                        <td className="p-3 font-medium">{order.name}</td>
                        <td className="p-3">{order.number}</td>
                        <td className="p-3">{order.city}</td>
                        <td className="p-3">{order.quantity}</td>
                        <td className="p-3">{order.nbr_colis}</td>
                        <td className="p-3 font-medium">${order.total}</td>

                        {/* STATUS */}
                        <td className="p-3">
                          <Badge
                            className={
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "returned"
                                ? "bg-red-100 text-red-700"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {order.status || "pending"}
                          </Badge>
                        </td>

                        {/* PAYMENT */}
                        <td className="p-3">
                          <Badge
                            className={
                              order.payment === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {order.payment || "unpaid"}
                          </Badge>
                        </td>

                        {/* LIVREUR */}
                        <td className="p-3">
                          <Badge variant="secondary">
                            {order.livreur || "—"}
                          </Badge>
                        </td>

                        <td className="p-3">
                          {new Date(order.created_at).toLocaleDateString()}
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
                  No orders yet
                </p>
              </div>

            )}

          </CardContent>

        </Card>

      </div>
    </div>
  )
}