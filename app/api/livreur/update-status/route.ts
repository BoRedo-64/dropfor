
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

  const { order_number, status, comment } = await req.json()

  if (!order_number || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      comment, // 🔥 NEW FIELD
    })
    .eq("order_number", order_number)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
