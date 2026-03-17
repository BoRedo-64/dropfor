import { createClient } from "@/lib/supabase/server"

export async function getUserStats() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // ✅ today range
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // ✅ fetch today's orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", todayStart.toISOString())
    .lte("created_at", todayEnd.toISOString())

  if (error) {
    console.error(error)
    return null
  }

  const safeOrders = orders || []

  // ✅ counts
  const total = safeOrders.length

  const deliveredOrders = safeOrders.filter(
    (o) => o.status === "delivered"
  )
  const delivered = deliveredOrders.length

  const returns = safeOrders.filter(
    (o) => o.status === "returned"
  ).length

  // ✅ revenue ONLY from delivered
  const revenue =
    deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0) -
    7 * delivered

  return {
    products: 0,
    revenue,
    balance: 0,
    total,
    delivered,
    returns,
  }
}