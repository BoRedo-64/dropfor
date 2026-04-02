import { createClient } from "@/lib/supabase/server"

export async function getOrdersStatusData() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("status")

  if (!orders) return []

  const counts: Record<string, number> = {}

  for (const order of orders) {
    const status = order.status // ✅ RAW VALUE

    if (!counts[status]) counts[status] = 0
    counts[status]++
  }

  // ✅ IMPORTANT: keep RAW status (no translation here)
  return Object.entries(counts).map(([status, value]) => ({
    name: status,
    value,
  }))
}
