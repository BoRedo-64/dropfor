import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function AdminPickupsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  //orders
  const { data: orders } = await supabase
  .from("orders")
  .select("pickup_id")
  
  if (!user) redirect("/auth/login")

  // 🔥 get pickups (latest first)
  const { data: pickups } = await supabase
    .from("pickups")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-8 px-4">

      <h1 className="text-2xl font-bold mb-6">
        Pickup Requests
      </h1>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {pickups?.map((pickup) => {

              const statusStyle =
                pickup.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : pickup.status === "accepted"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"

              return (
                <tr key={pickup.id} className="border-t">

                  <td className="p-3">
                    #{pickup.id.slice(0, 8)}
                  </td>

                  <td className="p-3">
                    {pickup.user_id}
                  </td>

                  <td className="p-3">
                    {
                      orders?.filter(o => o.pickup_id === pickup.id).length || 0
                    }
                  </td>

                  <td className="p-3">
                    <Badge className={statusStyle}>
                      {pickup.status}
                    </Badge>
                  </td>

                  <td className="p-3">
                    {new Date(pickup.created_at).toLocaleDateString("fr-FR")}
                  </td>

                </tr>
              )
            })}
          </tbody>

        </table>

        {!pickups?.length && (
          <div className="text-center py-10 text-muted-foreground">
            No pickup requests
          </div>
        )}
      </div>

    </div>
  )
}
