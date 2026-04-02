import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { order_number } = await req.json()

  if (!order_number) {
    return NextResponse.json(
      { error: "Missing order number" },
      { status: 400 }
    )
  }

  const parsedNumber = Number(order_number)

  if (isNaN(parsedNumber)) {
    return NextResponse.json(
      { error: "Invalid order number" },
      { status: 400 }
    )
  }

  // 🔥 1. UPDATE ORDER
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "au depot" })
    .eq("order_number", parsedNumber)
    .ilike("status", "pickup%") // safer match
    .select()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // ❗ nothing updated
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Order not in pickup state" },
      { status: 400 }
    )
  }

  const order = data[0]

  // 🔥 2. GET PICKUP ID
  const pickupId = order.pickup_id

  if (!pickupId) {
    return NextResponse.json({ success: true })
  }

  // 🔥 3. GET ALL ORDERS IN THIS PICKUP
  const { data: pickupOrders, error: pickupError } = await supabase
    .from("orders")
    .select("status")
    .eq("pickup_id", pickupId)

  if (pickupError || !pickupOrders) {
    return NextResponse.json({ success: true })
  }

  // 🔥 4. CHECK IF ALL ARE "au depot"
  const allDone = pickupOrders.every(
    (o) => o.status === "au depot"
  )

  // 🔥 5. UPDATE PICKUP IF COMPLETE
  if (allDone) {
    await supabase
      .from("pickups")
      .update({
        status: "done",
      })
      .eq("id", pickupId)
  }

  return NextResponse.json({ success: true })
}
