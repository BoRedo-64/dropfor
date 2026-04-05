import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Eye, Pencil, ArrowUp, ArrowDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderViewSheet } from "@/components/order-view-sheet"
import { getStatusConfig } from "@/lib/status" // 🔥 NEW

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { OrdersFilters } from "@/components/orders-filters"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    status?: string
    payment?: string
    city?: string
    sort?: string
    order?: string
    page?: string
    limit?: string
  }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const params = await searchParams

  // pagination
  const page = Number(params.page || "1")
  const limit = Number(params.limit || "20")

  const from = (page - 1) * limit
  const to = from + limit - 1

  // sorting
  const sort = params.sort || "created_at"
  const ascending = params.order === "asc"

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)

  // filters
  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,number.ilike.%${params.search}%`
    )
  }

  if (params.status) query = query.eq("status", params.status)
  if (params.payment) query = query.eq("payment", params.payment)
  if (params.city) query = query.eq("city", params.city)

  query = query.order(sort, { ascending })
  query = query.range(from, to)

  const { data: orders, count } = await query

  const totalPages = Math.ceil((count || 0) / limit) || 1
  const safePage = Math.min(page, totalPages)

  const buildUrl = (field: string) => {
    const newParams = new URLSearchParams(params as any)

    const currentOrder =
      params.sort === field && params.order === "asc"
        ? "desc"
        : "asc"

    newParams.set("sort", field)
    newParams.set("order", currentOrder)

    return `?${newParams.toString()}`
  }

  const buildPageUrl = (newPage: number) => {
    const newParams = new URLSearchParams(params as any)
    newParams.set("page", String(newPage))
    return `?${newParams.toString()}`
  }

  const sortIcon = (field: string) => {
    if (params.sort !== field) return null
    return params.order === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    )
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your customer orders
          </p>
        </div>

        {/* Filters */}
        <OrdersFilters filters={params} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Orders List</CardTitle>
              <CardDescription>
                All orders from your customers
              </CardDescription>
            </div>

            <OrderViewSheet mode="create" order={{}}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter commande
              </Button>
            </OrderViewSheet>
          </CardHeader>

          <CardContent>
            {orders && orders.length > 0 ? (

              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">

                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">
                        <Link href={buildUrl("name")} className="flex items-center gap-1 hover:text-primary">
                          Client {sortIcon("name")}
                        </Link>
                      </th>

                      <th className="p-3 text-left">Phone</th>

                      <th className="p-3 text-left">
                        <Link href={buildUrl("city")} className="flex items-center gap-1 hover:text-primary">
                          Adresse {sortIcon("city")}
                        </Link>
                      </th>

                      <th className="p-3 text-left">
                        <Link href={buildUrl("quantity")} className="flex items-center gap-1 hover:text-primary">
                          Qty {sortIcon("quantity")}
                        </Link>
                      </th>

                      <th className="p-3 text-left">Colis</th>

                      <th className="p-3 text-left">
                        <Link href={buildUrl("total")} className="flex items-center gap-1 hover:text-primary">
                          Total {sortIcon("total")}
                        </Link>
                      </th>

                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Payment</th>
                      <th className="p-3 text-left">Livreur</th>

                      <th className="p-3 text-left">
                        <Link href={buildUrl("created_at")} className="flex items-center gap-1 hover:text-primary">
                          Date {sortIcon("created_at")}
                        </Link>
                      </th>

                      <th className="p-3 text-left"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => {
                      const status = getStatusConfig(order.status)

                      return (
                        <tr key={order.id} className="border-t">

                          <td className="p-3 font-medium">{order.name}</td>
                          <td className="p-3">{order.number}</td>
                          <td className="p-3">
                            {[order.city, order.adress].filter(Boolean).join(", ")}
                          </td>
                          <td className="p-3">{order.quantity}</td>
                          <td className="p-3">{order.content}</td>
                          <td className="p-3 font-medium">{order.total} DT</td>

                          {/* ✅ STATUS (FIXED) */}
                          <td className="p-3">
                            <Badge className={status.className}>
                              {status.label}
                            </Badge>
                          </td>

                          {/* PAYMENT */}
                          <td className="p-3">
                            <Badge className={
                              order.payment === "payé"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }>
                              {order.payment || "non payé"}
                            </Badge>
                          </td>

                          <td className="p-3">
                            <Badge variant="secondary">
                              {order.livreur_id ? "Assigned" : "Unassigned"}
                            </Badge>
                          </td>

                          {/* ✅ DATE FIX */}
                          <td className="p-3">
                            {new Date(order.created_at).toLocaleDateString("fr-FR")}
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-3">

                              <OrderViewSheet mode="view" order={order}>
                                <button className="text-muted-foreground hover:text-primary h-6 w-6">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </OrderViewSheet>

                            </div>
                          </td>

                        </tr>
                      )
                    })}
                  </tbody>

                </table>
              </div>

            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No orders yet
                </p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">

              <Link href={buildPageUrl(Math.max(1, safePage - 1))}>
                <Button disabled={safePage <= 1}>Previous</Button>
              </Link>

              <span className="text-sm">
                Page {safePage} of {totalPages}
              </span>

              <Link href={buildPageUrl(Math.min(totalPages, safePage + 1))}>
                <Button disabled={safePage >= totalPages}>Next</Button>
              </Link>

            </div>

          </CardContent>

        </Card>

      </div>
    </div>
  )
}
