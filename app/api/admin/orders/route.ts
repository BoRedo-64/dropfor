import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ✅ check admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")

  // ✅ STEP 1: get orders
  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: orders, error } = await query

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json([])
  }

  // ✅ STEP 2: get profiles
  const userIds = [...new Set(orders.map((o) => o.user_id))]

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .in("id", userIds)


    // ✅ STEP 3: merge + search by user name
    const merged = orders.map((order) => {
    const profile = profiles?.find((p) => p.id === order.user_id)

    return {
        ...order,
        profiles: profile || null,
    }
    })

    // ✅ NEW: filter by user name
    let filtered = merged

    if (search) {
    const s = search.toLowerCase()

    filtered = merged.filter((order) => {
        const fullName =
        `${order.profiles?.first_name ?? ""} ${order.profiles?.last_name ?? ""}`.toLowerCase()

        return fullName.includes(s)
    })
    }

    return NextResponse.json(filtered)

  return NextResponse.json(merged)
}
