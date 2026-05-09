import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  Package,
  Menu,
} from "lucide-react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PendingTable } from "@/components/pending-table"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<{
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

  // username
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single()

  const senderName = profile
    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
    : "Expéditeur"

  // query ONLY pending
  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .eq("status", "en attente")
    .order("created_at", { ascending: false })
    .range(from, to)

  const { data: orders, count } = await query

  const totalPages = Math.ceil((count || 0) / limit) || 1
  const safePage = Math.min(page, totalPages)

  const buildPageUrl = (newPage: number) => {
    const newParams = new URLSearchParams(params as any)
    newParams.set("page", String(newPage))
    return `?${newParams.toString()}`
  }

  return (
    <div className="py-6 md:py-12">
      <div className="container mx-auto px-4">

        {/* Mobile Header */}
        <div className="flex items-center gap-3 mb-6 md:hidden">

          <SidebarTrigger className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>

          <div>
            <h1 className="text-2xl font-bold leading-none">
              Pending Orders
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Orders waiting for pickup
            </p>
          </div>

        </div>

        {/* Desktop Header */}
        <div className="mb-6 hidden md:block">

          <h1 className="text-2xl font-bold">
            Pending Orders
          </h1>

        </div>

        <Card>

          <CardContent className="pt-6">

            {orders && orders.length > 0 ? (

              <div className="overflow-x-auto">
                <PendingTable
                  orders={orders}
                  senderName={senderName}
                />
              </div>

            ) : (

              <div className="text-center py-12">

                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />

                <p className="text-muted-foreground">
                  No pending orders
                </p>

              </div>

            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">

              <Link href={buildPageUrl(Math.max(1, safePage - 1))}>
                <Button disabled={safePage <= 1}>
                  Previous
                </Button>
              </Link>

              <span className="text-sm">
                Page {safePage} of {totalPages}
              </span>

              <Link href={buildPageUrl(Math.min(totalPages, safePage + 1))}>
                <Button disabled={safePage >= totalPages}>
                  Next
                </Button>
              </Link>

            </div>

          </CardContent>

        </Card>

      </div>
    </div>
  )
}