import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  Package,
  Menu,
} from "lucide-react"

import { PickupsTable } from "@/components/pickups-table"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function PickupsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // GET PICKUPS + COUNT ORDERS
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
    <div className="py-6 md:py-12">
      <div className="container mx-auto px-4">

        {/* Mobile Header */}
        <div className="flex items-center gap-3 mb-6 md:hidden">

          <SidebarTrigger className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>

          <div>
            <h1 className="text-2xl font-bold leading-none">
              Pickups
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Pickup history
            </p>
          </div>

        </div>

        {/* Desktop Header */}
        <div className="mb-6 hidden md:block">

          <h1 className="text-2xl font-bold">
            Pickup History
          </h1>

        </div>

        <Card>

          <CardContent className="pt-6">

            {pickups && pickups.length > 0 ? (

              <div className="overflow-x-auto">
                <PickupsTable pickups={pickups || []} />
              </div>

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