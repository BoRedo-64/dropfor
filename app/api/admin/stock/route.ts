import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { order_number } = await req.json()

  if (!order_number) {
    return NextResponse.json({ error: "Missing order number" }, { status: 400 })
  }

  // 🔥 UPDATE ORDER
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "au depot" })
    .eq("order_number", order_number)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}