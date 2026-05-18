import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

import {
  deleteOrder as deleteCosmosOrder,
} from "@/lib/integrations/cosmos"

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // GET ORDER
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // SECURITY:
    // ONLY pending orders deletable
    if (order.status !== "en attente") {
      return NextResponse.json(
        {
          error:
            "Only pending orders can be deleted",
        },
        {
          status: 400,
        }
      )
    }

    /* =========================================
       DELETE FROM COSMOS FIRST
    ========================================= */

    if (order.courier_barcode) {

      const cosmos =
        await deleteCosmosOrder(
          order.courier_barcode
        )

      if (!cosmos.success) {

        console.error(
          "COSMOS DELETE ERROR:",
          cosmos.error
        )

        return NextResponse.json(
          {
            error:
              "Failed to delete order from courier",
          },
          {
            status: 500,
          }
        )
      }
    }

    /* =========================================
       DELETE LOCAL ORDER
    ========================================= */

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({
      success: true,
    })

  } catch (err) {

    console.error(err)

    return NextResponse.json(
      {
        error: "Failed to delete order",
      },
      {
        status: 500,
      }
    )
  }
}