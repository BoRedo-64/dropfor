import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { getStatusConfig } from "@/lib/status"

import {
  Menu,
} from "lucide-react"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function PickupDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // await params
  const { id: pickupId } = await params

  // SAFE QUERY
  const { data: pickup } = await supabase
    .from("pickups")
    .select("*")
    .eq("id", pickupId)
    .maybeSingle()

  // NOT FOUND
  if (!pickup) {
    redirect("/account/pickups")
  }

  // SECURITY CHECK
  if (pickup.user_id !== user.id) {
    redirect("/account/pickups")
  }

  // GET ORDERS
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("pickup_id", pickupId)
    .order("created_at", { ascending: false })

  const pickupStatus = getStatusConfig(pickup.status)

  return (
    <div className="py-6 md:py-12">
      <div className="container mx-auto px-4">

        {/* Mobile Header */}
        <div className="flex items-center gap-3 mb-6 md:hidden">

          <SidebarTrigger className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>

          <div>
            <h1 className="text-2xl font-bold leading-none">
              Pickup
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              #{pickup.id.slice(0, 8)}
            </p>
          </div>

        </div>

        {/* Desktop Header */}
        <div className="mb-6 hidden md:block">

          <h1 className="text-2xl font-bold">
            Pickup #{pickup.id.slice(0, 8)}
          </h1>

        </div>

        {/* Pickup Info */}
        <Card className="mb-6">

          <CardHeader>
            <CardTitle>
              Pickup Info
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Status
              </span>

              <Badge className={pickupStatus.className}>
                {pickupStatus.label}
              </Badge>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Date
              </span>

              <span>
                {new Date(pickup.created_at)
                  .toLocaleDateString("fr-FR")}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Orders
              </span>

              <span>
                {orders?.length || 0}
              </span>
            </div>

          </CardContent>

        </Card>

        {/* Orders Table */}
        <Card>

          <CardHeader>
            <CardTitle>
              Orders
            </CardTitle>
          </CardHeader>

          <CardContent>

            {orders && orders.length > 0 ? (

              <div className="rounded-md border overflow-x-auto">

                <table className="w-full text-sm min-w-[700px]">

                  <thead className="bg-muted/50">
                    <tr>

                      <th className="p-3 text-left">
                        Client
                      </th>

                      <th className="p-3 text-left">
                        Phone
                      </th>

                      <th className="p-3 text-left">
                        City
                      </th>

                      <th className="p-3 text-left">
                        Total
                      </th>

                      <th className="p-3 text-left">
                        Status
                      </th>

                      <th className="p-3 text-left">
                        Date
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {orders.map((order) => {
                      const status = getStatusConfig(order.status)

                      return (
                        <tr key={order.id} className="border-t">

                          <td className="p-3 font-medium">
                            {order.name}
                          </td>

                          <td className="p-3">
                            {order.number}
                          </td>

                          <td className="p-3">
                            {order.city}
                          </td>

                          <td className="p-3 font-medium">
                            ${order.total}
                          </td>

                          <td className="p-3">
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                          </td>

                          <td className="p-3">
                            {new Date(order.created_at)
                              .toLocaleDateString("fr-FR")}
                          </td>

                        </tr>
                      )
                    })}

                  </tbody>

                </table>

              </div>

            ) : (

              <p className="text-muted-foreground text-center py-10">
                No orders in this pickup
              </p>

            )}

          </CardContent>

        </Card>

      </div>
    </div>
  )
}