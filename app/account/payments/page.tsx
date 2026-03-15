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

export default async function PaymentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const payments = (await getPayments()) || []

  const totalPaid = payments
    .filter((p) => p.status === "Payée")
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const pendingPayments = payments
    .filter((p) => p.status === "Non Payée")
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const lastPayment =
    payments.length > 0
      ? new Date(payments[0].created_at).toLocaleDateString()
      : "No payments yet"

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payments</h1>
          <p className="text-muted-foreground">
            Track your payment history and status
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <DollarSign className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xl font-bold">${totalPaid}</p>
                <p className="text-sm text-muted-foreground">Total Paid</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <Clock className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-xl font-bold">${pendingPayments}</p>
                <p className="text-sm text-muted-foreground">
                  Pending Payments
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <CreditCard className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xl font-bold">{lastPayment}</p>
                <p className="text-sm text-muted-foreground">
                  Last Payment
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </CardTitle>

            <CardDescription>
              All your latest payments
            </CardDescription>
          </CardHeader>

          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-4">

                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >

                    <div>
                      <p className="font-medium text-foreground">
                        {payment.type}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">

                      <Badge
                        variant={
                          payment.status === "Payée"
                            ? "default"
                            : payment.status === "Non Payée"
                            ? "secondary"
                            : "outline"
                        }
                        className="mb-1"
                      >
                        {payment.status}
                      </Badge>

                      <p className="text-sm font-medium text-foreground">
                        ${payment.amount}
                      </p>

                    </div>

                  </div>
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