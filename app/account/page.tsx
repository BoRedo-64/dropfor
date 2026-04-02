import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { OrdersBarChart } from "@/components/orders-chart"
import { OrdersStatusChart } from "@/components/orders-status-chart"
import { getOrdersChartData } from "@/lib/chart-calc"
import { getOrdersStatusData } from "@/lib/status-calc"

import {
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
} from "lucide-react"

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "user") {
    if (profile?.role === "admin") redirect("/admin")
    if (profile?.role === "livreur") redirect("/livreur")
    redirect("/")
  }

  // 🔥 FETCH ORDERS
  const { data: orders } = await supabase
    .from("orders")
    .select("status, created_at")
    .eq("user_id", user.id)

  const today = new Date().toISOString().slice(0, 10)

  const stats = {
    today: 0,
    "en attente": 0,
    "en cours": 0,
    "livré": 0,
    "retour": 0,
    "a verifier": 0,
  }

  orders?.forEach((order) => {
    const orderDate = order.created_at?.slice(0, 10)

    if (orderDate === today) stats.today++

    if (stats[order.status as keyof typeof stats] !== undefined) {
      stats[order.status as keyof typeof stats]++
    }
  })

  // 🎨 CARD CONFIG WITH COLORS
  const cards = [
    {
      icon: Calendar,
      label: "Aujourd'hui",
      value: stats.today,
      className: "bg-gray-50 text-gray-600",
      iconColor: "text-gray-600",
    },
    {
      icon: Clock,
      label: "En attente",
      value: stats["en attente"],
      className: "bg-yellow-50 text-yellow-600",
      iconColor: "text-yellow-600",
    },
    {
      icon: Truck,
      label: "En cours",
      value: stats["en cours"],
      className: "bg-blue-50 text-blue-600",
      iconColor: "text-blue-600",
    },
    {
      icon: CheckCircle,
      label: "Livré",
      value: stats["livré"],
      className: "bg-green-50 text-green-600",
      iconColor: "text-green-600",
    },
    {
      icon: RotateCcw,
      label: "Retour",
      value: stats["retour"],
      className: "bg-red-50 text-red-600",
      iconColor: "text-red-600",
    },
    {
      icon: AlertTriangle,
      label: "À vérifier",
      value: stats["a verifier"],
      className: "bg-purple-50 text-purple-600",
      iconColor: "text-purple-600",
    },
  ]

  const chartData = await getOrdersChartData()
  const statusData = await getOrdersStatusData()

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Suivez vos commandes et performances
          </p>
        </div>

        {/* 🎨 COLORED CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {cards.map((card) => (
            <Card key={card.label} className={card.className}>
              <CardContent className="p-4 flex items-center gap-3">

                <card.icon className={`h-6 w-6 ${card.iconColor}`} />

                <div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs opacity-70">
                    {card.label}
                  </p>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">

          <Card>
            <CardContent className="pt-6">
              <OrdersBarChart data={chartData} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <OrdersStatusChart data={statusData} />
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}