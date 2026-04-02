import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { PickupsTable } from "@/components/pickups-table"

export default async function PickupsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // 🔥 GET PICKUPS + COUNT ORDERS
  const { data: pickups } = await supabase
    .from("pickups")
    .select(`
      id,
      status,
      created_at,
      orders (id)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Pickup History</h1>
        </div>

        <Card>
          <CardContent className="pt-6">

            {pickups && pickups.length > 0 ? (

              <PickupsTable pickups={pickups || []} />

            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No pickups yet
                </p>
              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  )
}
