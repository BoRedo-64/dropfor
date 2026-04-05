import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getPayments } from "@/lib/payments"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import {
  CreditCard,
  Package,
  DollarSign,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default async function PaymentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // 🧠 Generate YESTERDAY payment automatically
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)


  // 📊 Fetch payments
  const payments = await getPayments(user.id)

  const totalPaid = payments
    .filter((p) => p.status === "reçu")
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const pendingPayments = payments
    .filter((p) => p.status === "non reçu")
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const receivedPayments = payments
    .filter((p) => p.status === "reçu")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const lastPayment =
    receivedPayments.length > 0
      ? new Date(receivedPayments[0].date).toLocaleDateString()
      : "Pas encore"

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payments</h1>
          <p className="text-muted-foreground">
            Track your payment history and earnings
          </p>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xl font-bold">
                  {totalPaid.toFixed(2)} TND
                </p>
                <p className="text-sm text-muted-foreground">
                  Paiements reçus
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <Clock className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-xl font-bold">
                  {pendingPayments.toFixed(2)} TND
                </p>
                <p className="text-sm text-muted-foreground">
                  Paiements non reçus
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xl font-bold">
                  {lastPayment}
                </p>
                <p className="text-sm text-muted-foreground">
                  Dernier Paiement
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </CardTitle>

            <CardDescription>
              Daily calculated payments
            </CardDescription>
          </CardHeader>

          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-4">

                {payments.map((payment) => (
                  <Link
                    href={`/account/payments/${payment.id}`}
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition"
                  >

                    <div>
                      <p className="font-medium">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {payment.livree_count} livrées • {payment.retour_count} retours
                      </p>
                    </div>

                    <div className="text-right">

                      <Badge
                        variant={
                          payment.status === "reçu"
                            ? "default"
                            : "secondary"
                        }
                        className="mb-1"
                      >
                        {payment.status}
                      </Badge>

                      <p className="text-sm font-medium">
                        {Number(payment.amount).toFixed(2)} TND
                      </p>

                    </div>

                  </Link>
                ))}

              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No payments yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}