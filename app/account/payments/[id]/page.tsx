import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import {
  ArrowLeft,
  DollarSign,
  Package,
  Truck,
  RotateCcw,
} from "lucide-react"

import Link from "next/link"

export default async function PaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  // ✅ FIX: unwrap params
  const { id } = await params

  // 📥 Fetch payment
  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!payment) return notFound()

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Back */}
        <Link
          href="/account/payments"
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Payment Details
          </h1>
          <p className="text-muted-foreground">
            {new Date(payment.date).toLocaleDateString()}
          </p>
        </div>

        {/* STATUS + FINAL */}
        <Card className="mb-6">
          <CardContent className="p-6 flex items-center justify-between">

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Status
              </p>
              <Badge
                variant={
                  payment.status === "Payée"
                    ? "default"
                    : "secondary"
                }
              >
                {payment.status}
              </Badge>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Final Amount
              </p>
              <p className="text-2xl font-bold">
                {Number(payment.amount).toFixed(2)} TND
              </p>
            </div>

          </CardContent>
        </Card>

        {/* BREAKDOWN */}
        <div className="space-y-4">

          {/* Delivered */}
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Delivered Orders</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.livree_count} orders
                  </p>
                </div>
              </div>

              <p className="font-semibold">
                +{Number(payment.total_livree).toFixed(2)} TND
              </p>
            </CardContent>
          </Card>

          {/* Returns */}
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">Returned Orders</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.retour_count} returns
                  </p>
                </div>
              </div>

              <p className="font-semibold text-red-500">
                -{Number(payment.total_retour_penalty).toFixed(2)} TND
              </p>
            </CardContent>
          </Card>

          {/* Delivery */}
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Delivery Cost</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.livree_count} × 8 TND
                  </p>
                </div>
              </div>

              <p className="font-semibold text-orange-500">
                -{Number(payment.delivery_cost).toFixed(2)} TND
              </p>
            </CardContent>
          </Card>

          {/* Retenue */}
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Retenue (3%)</p>
                  <p className="text-sm text-muted-foreground">
                    Tax deduction
                  </p>
                </div>
              </div>

              <p className="font-semibold text-yellow-600">
                -{Number(payment.retenue).toFixed(2)} TND
              </p>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}