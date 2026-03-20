import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-4">Livreur Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome, you can see your assigned orders here.
      </p>
    </div>
  )
}
