"use client"

import { createClient } from "@/lib/supabase/client"
import { redirect } from "next/navigation"

import { Badge } from "@/components/ui/badge"

import {
  Check,
  Menu,
} from "lucide-react"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { useEffect, useState } from "react"

export default function AdminPickupsPage() {
  const supabase = createClient()

  const [pickups, setPickups] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return redirect("/auth/login")

      const { data: pickupsData } = await supabase
        .from("pickups")
        .select("*")
        .order("created_at", { ascending: false })

      const { data: ordersData } = await supabase
        .from("orders")
        .select("pickup_id")

      // FETCH PROFILES
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")

      setPickups(pickupsData || [])
      setOrders(ordersData || [])
      setProfiles(profilesData || [])
    }

    fetchData()
  }, [])

  const handleAccept = async (pickupId: string) => {
    try {
      await fetch("/api/admin/pickups/accept", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ pickupId }),
      })

      setPickups((prev) =>
        prev.map((p) =>
          p.id === pickupId
            ? { ...p, status: "accepted" }
            : p
        )
      )

    } catch (err) {
      console.error(err)
      alert("Erreur")
    }
  }

  return (
    <div className="container mx-auto py-6 md:py-8 px-4">

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
            Pickup requests
          </p>
        </div>

      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-6">

        <h1 className="text-2xl font-bold">
          Pickup Requests
        </h1>

      </div>

      <div className="rounded-md border overflow-x-auto">

        <table className="w-full text-sm min-w-[800px]">

          <thead className="bg-muted/50">

            <tr>

              <th className="p-3 text-left">
                ID
              </th>

              <th className="p-3 text-left">
                User
              </th>

              <th className="p-3 text-left">
                Orders
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left"></th>

            </tr>

          </thead>

          <tbody>

            {pickups.map((pickup) => {

              const statusStyle =
                pickup.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : pickup.status === "accepted"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"

              // FIND PROFILE
              const profile = profiles.find(
                (p) => p.id === pickup.user_id
              )

              const fullName = profile
                ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                : pickup.user_id

              return (
                <tr
                  key={pickup.id}
                  className="border-t"
                >

                  <td className="p-3">
                    #{pickup.id.slice(0, 8)}
                  </td>

                  <td className="p-3">
                    {fullName || "—"}
                  </td>

                  <td className="p-3">
                    {
                      orders.filter(
                        o => o.pickup_id === pickup.id
                      ).length
                    }
                  </td>

                  <td className="p-3">

                    <Badge className={statusStyle}>
                      {pickup.status}
                    </Badge>

                  </td>

                  <td className="p-3">
                    {new Date(pickup.created_at)
                      .toLocaleDateString("fr-FR")}
                  </td>

                  <td className="p-3">

                    {pickup.status === "pending" && (

                      <button
                        onClick={() =>
                          handleAccept(pickup.id)
                        }
                        className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition"
                      >

                        <Check className="h-4 w-4 text-white" />

                      </button>

                    )}

                  </td>

                </tr>
              )
            })}

          </tbody>

        </table>

        {!pickups.length && (

          <div className="text-center py-10 text-muted-foreground">
            No pickup requests
          </div>

        )}

      </div>

    </div>
  )
}