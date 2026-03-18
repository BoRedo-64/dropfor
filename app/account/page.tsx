import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { OrdersBarChart } from "@/components/orders-chart"
import { OrdersStatusChart } from "@/components/orders-status-chart"
import { getOrdersChartData } from "@/lib/chart-calc"
import { getOrdersStatusData } from "@/lib/status-calc"

import {
  Package,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  RotateCcw,
} from "lucide-react"

import { getUserStats } from "@/lib/stats"

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const stats = await getUserStats()
  const chartData = await getOrdersChartData()
  const statusData = await getOrdersStatusData() // ✅ NEW

  const topStats = [
    {
      icon: Package,
      label: "Produits",
      value: stats?.products ?? 0,
    },
    {
      icon: DollarSign,
      label: "Revenu",
      value: `$${stats?.revenue ?? 0}`,
    },
    {
      icon: DollarSign,
      label: "Solde",
      value: `$${stats?.balance ?? 0}`,
    },
  ]

  const orderStats = [
    {
      icon: ShoppingCart,
      label: "Total",
      value: stats?.total ?? 0,
    },
    {
      icon: CheckCircle,
      label: "Livrés",
      value: stats?.delivered ?? 0,
    },
    {
      icon: RotateCcw,
      label: "Retours",
      value: stats?.returns ?? 0,
    },
  ]

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

        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {topStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Orders Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {orderStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 📊 CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes (7 derniers jours)</CardTitle>
              <CardDescription>
                Total des commandes et retours
              </CardDescription>
            </CardHeader>

            <CardContent>
              <OrdersBarChart data={chartData} />
            </CardContent>
          </Card>

          {/* ✅ NEW STATUS CHART (NO NESTED CARD) */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des Statuts</CardTitle>
              <CardDescription>
                Distribution des commandes par statut
              </CardDescription>
            </CardHeader>

            <CardContent>
              <OrdersStatusChart data={statusData} />
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}
