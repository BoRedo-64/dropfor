import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ShoppingCart,
  DollarSign,
  User,
  CheckCircle,
  RotateCcw,
} from "lucide-react"
import { getPayments } from "@/lib/payments"
import { getUserStats } from "@/lib/stats"
import { OrderRateChart } from "@/components/order-rate-chart"

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const recentOrders = (await getPayments()) || []
  const stats = await getUserStats()

  if (!user) {
    redirect("/auth/login")
  }

  const firstName = user.user_metadata?.first_name || "User"

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
        <div className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {firstName}!
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-2">
              Free Plan
            </Badge>
          </div>
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

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Order Success Rate</CardTitle>
                <CardDescription>
                  Delivered vs Returned Orders
                </CardDescription>
              </CardHeader>

              <CardContent>
                <OrderRateChart
                  delivered={stats?.delivered ?? 0}
                  returns={stats?.returns ?? 0}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}