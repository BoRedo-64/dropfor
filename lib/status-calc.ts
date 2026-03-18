import { createClient } from "@/lib/supabase/server"

export async function getOrdersStatusData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  // ✅ fetch only needed column (optimized)
  const { data, error } = await supabase
    .from("orders")
    .select("status")
    .eq("user_id", user.id)

  if (error || !data) {
    console.error("Error fetching status data:", error)
    return []
  }

  // ✅ initialize counters
  let delivered = 0
  let returned = 0
  let shipped = 0
  let pending = 0

  // ✅ count statuses
  for (const order of data) {
    switch (order.status) {
      case "delivered":
        delivered++
        break
      case "returned":
        returned++
        break
      case "shipped":
        shipped++
        break
      default:
        pending++
        break
    }
  }

  // ✅ IMPORTANT: keep order for chart colors
  return [
    { name: "Livré", value: delivered },
    { name: "Retour", value: returned },
    { name: "En livraison", value: shipped },
    { name: "En attente", value: pending },
  ]
}
