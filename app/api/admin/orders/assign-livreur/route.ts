import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { orderId, livreurId } = await req.json()

  const { error } = await supabase
    .from("orders")
    .update({ livreur_id: livreurId })
    .eq("id", orderId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}