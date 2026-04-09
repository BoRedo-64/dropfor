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

    const {
      name,
      number,
      city,
      adress,
      quantity,
      nbr_colis,
      total,
      content,
    } = body

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      name,
      number,
      city,
      adress,
      quantity,
      nbr_colis,
      total,
      content,
      status: "en attente",
      payment: "unpaid",
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}