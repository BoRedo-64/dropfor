import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  Badge,
} from "@/components/ui/badge"

import {
  Package,
  RotateCcw,
  Eye,
  Menu,
} from "lucide-react"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { OrderViewSheet } from "@/components/order-view-sheet"
import { getStatusConfig } from "@/lib/status"

export default async function ReturnsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // GET RETURNS ONLY
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "retour")
    .order("created_at", { ascending: false })

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
              Retour
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Commandes retournées
            </p>
          </div>

        </div>

        {/* Desktop Header */}
        <div className="mb-8 hidden md:block">

          <h1 className="text-3xl font-bold mb-2">
            Retour
          </h1>

          <p className="text-muted-foreground">
            Consultez vos commandes retournées
          </p>

        </div>

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">

              <RotateCcw className="h-5 w-5" />

              Retours

            </CardTitle>

            <CardDescription>
              Toutes les commandes retournées
            </CardDescription>

          </CardHeader>

          <CardContent>

            {orders && orders.length > 0 ? (

              <div className="rounded-md border overflow-x-auto">

                <table className="w-full text-sm min-w-[850px]">

                  <thead className="bg-muted/50">

                    <tr>

                      <th className="p-3 text-left">
                        Client
                      </th>

                      <th className="p-3 text-left">
                        Téléphone
                      </th>

                      <th className="p-3 text-left">
                        Ville
                      </th>

                      <th className="p-3 text-left">
                        Produit
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

                      <th className="p-3 text-left"></th>

                    </tr>

                  </thead>

                  <tbody>

                    {orders.map((order) => {
                      const status = getStatusConfig(order.status)

                      return (
                        <tr
                          key={order.id}
                          className="border-t"
                        >

                          <td className="p-3 font-medium">
                            {order.name}
                          </td>

                          <td className="p-3">
                            {order.number}
                          </td>

                          <td className="p-3">
                            {order.city}
                          </td>

                          <td className="p-3">
                            {order.content}
                          </td>

                          <td className="p-3 font-medium">
                            {order.total} DT
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

                          <td className="p-3">

                            <OrderViewSheet
                              mode="view"
                              order={order}
                            >

                              <button className="text-muted-foreground hover:text-primary">

                                <Eye className="h-4 w-4" />

                              </button>

                            </OrderViewSheet>

                          </td>

                        </tr>
                      )
                    })}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="text-center py-16">

                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />

                <p className="text-muted-foreground">
                  Aucun retour pour le moment
                </p>

              </div>

            )}

          </CardContent>

        </Card>

      </div>
    </div>
  )
}