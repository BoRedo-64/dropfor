import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Package,
  Calendar,
  Truck,
  CheckCircle,
  Menu,
} from "lucide-react"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { OrdersBarChart } from "@/components/orders-chart"
import { OrdersStatusChart } from "@/components/orders-status-chart"

import { getOrdersChartData } from "@/lib/chart-calc"
import { getOrdersStatusData } from "@/lib/status-calc"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // role check
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/")

  // FETCH DATA
  const { data: orders } = await supabase
    .from("orders")
    .select("status, created_at")

  const { data: pickups } = await supabase
    .from("pickups")
    .select("status, created_at")

  const today = new Date().toISOString().slice(0, 10)

  let totalOrders = 0
  let todayOrders = 0
  let delivered = 0
  let pickupsPending = 0

  orders?.forEach((o) => {
    totalOrders++

    if (o.created_at?.slice(0, 10) === today) {
      todayOrders++
    }

    if (o.status === "livré") {
      delivered++
    }
  })

  pickups?.forEach((p) => {
    if (p.status === "pending") pickupsPending++
  })

  const deliveryRate = totalOrders
    ? ((delivered / totalOrders) * 100).toFixed(1)
    : "0"

  // CARDS
  const stats = [
    {
      label: "Total commandes",
      value: totalOrders,
      icon: Package,
    },
    {
      label: "Aujourd'hui",
      value: todayOrders,
      icon: Calendar,
    },
    {
      label: "Pickups en attente",
      value: pickupsPending,
      icon: Truck,
    },
    {
      label: "Taux livraison",
      value: `${deliveryRate}%`,
      icon: CheckCircle,
    },
  ]

  // charts
  const chartData = await getOrdersChartData()
  const statusData = await getOrdersStatusData()

  // recent pickups
  const { data: recentPickups } = await supabase
    .from("pickups")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

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
              Admin Dashboard
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Vue globale
            </p>
          </div>

        </div>

        {/* Desktop Header */}
        <div className="mb-8 hidden md:block">

          <h1 className="text-3xl font-bold mb-2">
            Admin Dashboard
          </h1>

          <p className="text-muted-foreground">
            Vue globale de la plateforme
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          {stats.map((stat) => (
            <Card key={stat.label}>

              <CardContent className="p-4 flex items-center gap-3">

                <stat.icon className="h-6 w-6 text-primary shrink-0" />

                <div className="min-w-0">
                  <p className="text-2xl font-bold truncate">
                    {stat.value}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>

              </CardContent>

            </Card>
          ))}

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <Card>

            <CardHeader>
              <CardTitle>
                Commandes (7 jours)
              </CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <OrdersBarChart data={chartData} />
            </CardContent>

          </Card>

          <Card>

            <CardHeader>
              <CardTitle>
                Répartition des statuts
              </CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <OrdersStatusChart data={statusData} />
            </CardContent>

          </Card>

        </div>

        {/* RECENT PICKUPS */}
        <Card>

          <CardHeader>
            <CardTitle>
              Derniers Pickups
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="space-y-3">

              {recentPickups?.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center gap-4 border rounded-md px-4 py-3"
                >

                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      #{p.id.slice(0, 8)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(p.created_at)
                        .toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <span className="text-sm shrink-0">
                    {p.status}
                  </span>

                </div>
              ))}

            </div>

          </CardContent>

        </Card>

      </div>
    </div>
  )
}