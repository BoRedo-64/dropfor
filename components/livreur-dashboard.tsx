"use client"

import { getStatusConfig, OrderStatus } from "@/lib/status"
import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"

import { Package, Phone, MapPin, Calendar } from "lucide-react"

type Order = {
  id: string
  order_number: number
  name: string
  number: string
  city: string
  status: string
  created_at: string
}

export function LivreurDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [orderNumber, setOrderNumber] = useState("")
  const [status, setStatus] = useState<OrderStatus | "">("") // ✅ FIXED
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  async function fetchOrders() {
    try {
      setLoading(true)
      const res = await fetch("/api/livreur/orders")
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  async function handleUpdateStatus() {
    if (!orderNumber.trim() || !status) return

    await fetch("/api/livreur/update-status", {
      method: "POST",
      body: JSON.stringify({
        order_number: Number(orderNumber),
        status,
        comment,
      }),
    })

    setOrderNumber("")
    setStatus("")
    setComment("")

    fetchOrders()
  }

  const showComment =
    status === "retour" ||
    status === "a relancer" ||
    status === "a verifier"

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 py-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Livreur Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your assigned orders
          </p>
        </div>

        {/* STATUS UPDATE */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Quick Status Update</CardTitle>
            <CardDescription>
              Update order status quickly
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            <div>
              <Label>Order Number</Label>
              <Input
                placeholder="Enter order number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={status || undefined}
                onValueChange={(v: OrderStatus) => setStatus(v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>

                {/* ✅ USE CENTRALIZED STATUSES */}
                <SelectContent>
                  <SelectItem value="a verifier">A vérifier</SelectItem>
                  <SelectItem value="a relancer">A relancer</SelectItem>
                  <SelectItem value="en cours">En cours</SelectItem>
                  <SelectItem value="livré">Livré</SelectItem>
                  <SelectItem value="retour">Retour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showComment && (
              <div>
                <Label>Commentaire</Label>
                <textarea
                  className="w-full border rounded-md p-2 text-sm"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            )}

            <Button onClick={handleUpdateStatus} className="w-full">
              Update Status
            </Button>

          </CardContent>
        </Card>

        {/* ORDERS */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" />
            <h2 className="text-xl font-bold">Assigned Orders</h2>
          </div>

          {/* MOBILE */}
          <div className="grid gap-4 lg:hidden">
            {orders
              .filter((order) => order.status !== "livré")
              .map((order) => {
                const config = getStatusConfig(order.status)

                return (
                  <Card key={order.id}>
                    <CardContent className="pt-4 space-y-2">

                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">
                            #{order.order_number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.name}
                          </p>
                        </div>

                        <Badge className={config.className}>
                          {config.label}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="flex gap-2">
                          <Phone className="w-4 h-4" />
                          {order.number}
                        </div>
                        <div className="flex gap-2">
                          <MapPin className="w-4 h-4" />
                          {order.city}
                        </div>
                        <div className="flex gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created_at).toLocaleDateString("fr-FR")}
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {/* DESKTOP */}
          <div className="hidden lg:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-3 text-left">Order</th>
                      <th className="p-3 text-left">Client</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">City</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders
                      .filter((order) => order.status !== "livré")
                      .map((order) => {
                        const config = getStatusConfig(order.status)

                        return (
                          <tr key={order.id} className="border-t">
                            <td className="p-3 font-medium">
                              #{order.order_number}
                            </td>
                            <td className="p-3">{order.name}</td>
                            <td className="p-3">{order.number}</td>
                            <td className="p-3">{order.city}</td>
                            <td className="p-3">
                              <Badge className={config.className}>
                                {config.label}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {new Date(order.created_at).toLocaleDateString("fr-FR")}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>

                </table>
              </div>
            </Card>
          </div>

          {!loading && orders.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
              No assigned orders
            </p>
          )}

        </div>

      </div>
    </div>
  )
}
