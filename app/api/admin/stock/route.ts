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

  // 🔥 ONLY update pickup requested orders
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "au depot" })
    .eq("order_number", order_number)
    .eq("status", "pickup demandé") // ✅ IMPORTANT

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // ❗ nothing updated
  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Order not in pickup demandé state" },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
