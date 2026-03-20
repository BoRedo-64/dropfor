import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LivreurDashboard } from "@/components/livreur-dashboard"

export default async function LivreurPage() {
  const supabase = await createClient()

  // 🔐 get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // 🔐 get role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // 🚫 block non-livreur
  if (profile?.role !== "livreur") {
    redirect("/account") // or "/" or "/admin"
  }

  return <LivreurDashboard />
}
