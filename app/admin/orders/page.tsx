import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin-dashboard"

import {
  Menu,
} from "lucide-react"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const metadata = {
  title: "Admin Dashboard | DropShip Pro",
  description: "Manage users and their statistics",
}

export default async function AdminPage() {
  const supabase = await createClient()

  // get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // get role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  // block non-admin
  if (profile?.role !== "admin") {
    if (profile?.role === "user") redirect("/account")
    if (profile?.role === "livreur") redirect("/livreur")

    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Mobile Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-2 md:hidden">

        <SidebarTrigger className="h-10 w-10">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>

        <div>
          <h1 className="text-2xl font-bold leading-none">
            Admin
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Dashboard
          </p>
        </div>

      </div>

      <AdminDashboard />

    </div>
  )
}