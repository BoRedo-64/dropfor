import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"

export const metadata = {
  title: "Admin Dashboard | DropShip Pro",
  description: "Manage users and their statistics",
}

export default async function AdminPage() {
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

  // 🚫 block non-admin
  if (profile?.role !== "admin") {
    if (profile?.role === "user") redirect("/account")
    if (profile?.role === "livreur") redirect("/livreur")

    redirect("/") // fallback
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard />
    </div>
  )
}
