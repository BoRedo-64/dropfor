import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    )
  }
}