import { createClient } from "@/lib/supabase/server"

// 🔹 Get all payments (sorted)
export async function getPayments(userId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  return data || []
}