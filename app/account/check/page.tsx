import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Eye, Pencil, ArrowUp, ArrowDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderViewSheet } from "@/components/order-view-sheet"
import { getStatusConfig } from "@/lib/status"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

import { DeleteOrderButton } from "@/components/delete-order-button"

export default async function CheckPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
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

  const page = Number(params.page || "1")
  const limit = Number(params.limit || "20")

  const from = (page - 1) * limit
  const to = from + limit - 1

  const sort = params.sort || "created_at"
  const ascending = params.order === "asc"

  // 🔥 FORCE STATUS = a verifier
  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .eq("status", "a verifier")

  // 🔍 SEARCH ONLY
  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,number.ilike.%${params.search}%`
    )
  }

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
    return params.order === "asc"
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">À vérifier</h1>
          <p className="text-muted-foreground">
            Commandes nécessitant une vérification
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Liste des commandes</CardTitle>
              <CardDescription>
                Toutes les commandes à vérifier
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {orders && orders.length > 0 ? (

              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">

                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Client</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">City</th>
                      <th className="p-3 text-left">Total</th>
                      <th className="p-3 text-left">Commentaire</th> {/* 🔥 NEW */}
                      <th className="p-3 text-left">Date</th>
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
                          <td className="p-3">{order.city}</td>
                          <td className="p-3 font-medium">{order.total} DT</td>

                          {/* 🔥 COMMENT COLUMN */}
                          <td className="p-3 text-muted-foreground">
                            {order.comment || "-"}
                          </td>

                          <td className="p-3">
                            {new Date(order.created_at).toLocaleDateString("fr-FR")}
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-3">

                              <OrderViewSheet mode="view" order={order}>
                                <button className="text-muted-foreground hover:text-primary">
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
                  Aucune commande à vérifier
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
