import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 })
    }

    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id) // 🔥 SECURITY

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}