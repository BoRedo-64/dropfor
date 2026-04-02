import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderIds } = await req.json()

  if (!orderIds || orderIds.length === 0) {
    return NextResponse.json({ error: "No orders selected" }, { status: 400 })
  }

  // ✅ 1. create pickup
  const { data: pickup, error: pickupError } = await supabase
    .from("pickups")
    .insert({
      user_id: user.id,
      status: "pending",
    })
    .select()
    .single()

  if (pickupError) {
    return NextResponse.json({ error: pickupError.message }, { status: 500 })
  }

  // ✅ 2. attach orders
  const { error: ordersError } = await supabase
    .from("orders")
    .update({
      pickup_id: pickup.id,
      status: "pickup_requested", // 🔥 optional but recommended
    })
    .in("id", orderIds)
    .eq("user_id", user.id) // 🔒 security

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
