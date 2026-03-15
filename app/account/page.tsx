import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Truck, TrendingUp, Clock, DollarSign, User, Settings, CheckCircle, RotateCcw } from "lucide-react"
import { AccountSettings } from "@/components/account-settings"
import { getPayments } from "@/lib/payments"
import { getUserStats } from "@/lib/stats"
import { OrderRateChart } from "@/components/order-rate-chart"

const quickActions = [
  { icon: Package, label: "Browse Products", href: "/services" },
  { icon: Truck, label: "Track Orders", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
]

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const recentOrders = (await getPayments()) || []
  const stats = await getUserStats()

  if (!user) {
    redirect("/auth/login")
  }

  const firstName = user.user_metadata?.first_name || "User"
  const lastName = user.user_metadata?.last_name || ""
  const fullName = `${firstName} ${lastName}`.trim()
  const topStats = [
    {
      icon: Package,
      label: "Produits",
      value: stats?.products ?? 0,
      description: "In your catalog",
    },
    {
      icon: DollarSign,
      label: "Revenu",
      value: `$${stats?.revenue ?? 0}`,
      description: "This month",
    },
    {
      icon: DollarSign,
      label: "Solde",
      value: `$${stats?.balance ?? 0}`,
      description: "vs last month",
    },
  ]

  const orderStats = [
    {
      icon: ShoppingCart,
      label: "Total",
      value: stats?.total ?? 0,
      description: "Lifetime orders",
    },
    {
      icon: CheckCircle,
      label: "Livrés",
      value: stats?.delivered ?? 0,
      description: "Completed orders",
    },
    {
      icon: RotateCcw,
      label: "Retours",
      value: stats?.returns ?? 0,
      description: "Returned items",
    },
  ]

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Welcome back, {firstName}!
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Badge variant="secondary">Free Plan</Badge>
        </div>

        {/* Stats Grid - Top Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {topStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Grid - Orders Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {orderStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payments */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Paiements
                </CardTitle>
                <CardDescription>Tes Derniers Paiements</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">{order.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              order.status === "Payée"
                                ? "default"
                                : order.status === "Non Payée"
                                ? "secondary"
                                : "outline"
                            }
                            className="mb-1"
                          >
                            {order.status}
                          </Badge>
                          <p className="text-sm font-medium text-foreground">${order.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Success Rate</CardTitle>
              <CardDescription>Delivered vs Returned Orders</CardDescription>
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
      <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full" asChild>
              <Link href="https://partner.converty.shop" target="_blank">
                Converty
              </Link>
            </Button>

            <Button size="lg" variant="secondary" className="w-full" asChild>
              <Link href="https://fiabilo.tn/expediteur/dashboard.php" target="_blank">
                Intigo
              </Link>
            </Button>
      </div>
      </div>
    </div>
  )
}
