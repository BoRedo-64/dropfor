import { createClient } from "@/lib/supabase/server"

export async function getPayments() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase error:", error)
    return []
  }

  return data ?? []
}