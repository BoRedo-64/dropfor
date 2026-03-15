import { createClient } from "@/lib/supabase/server"

export async function getDailyOrders() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("orders_daily")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Orders fetch error:", error)
    return []
  }

  return data
}