import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()

  const { pickupId } = await req.json()

  if (!pickupId) {
    return NextResponse.json({ error: "Missing pickupId" }, { status: 400 })
  }

  const { error } = await supabase
    .from("pickups")
    .update({ status: "accepted" })
    .eq("id", pickupId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}