import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

import {
  createOrder as createCosmosOrder,
} from "@/lib/integrations/cosmos"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // AUTH
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // BODY
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

    /* =========================================
       CREATE LOCAL ORDER
    ========================================= */

    const {
      data: order,
      error,
    } = await supabase
      .from("orders")
      .insert({
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
      .select()
      .single()

    if (error || !order) {
      throw error
    }

    /* =========================================
       SEND TO COSMOS
    ========================================= */

    const cosmos = await createCosmosOrder({
      name: order.name,

      phone: order.number,

      address: order.adress,

      city: order.city,

      quantity:
        Number(order.quantity) || 1,

      packageCount:
        Number(order.nbr_colis) || 1,

      totalAmount:
        Number(order.total) || 0,

      content:
        order.content || "",

      externalBarcode:
        order.id,

      source: "dropfor",

      options: {
        allowToOpen: true,
        isFragile: false,
      },
    })

    /* =========================================
       COSMOS FAILED
    ========================================= */

    if (!cosmos.success) {

      console.error(
        "COSMOS ERROR:",
        cosmos.error
      )

      return NextResponse.json({
        success: true,

        warning:
          "Order created locally but failed to sync with courier",

        order,
      })
    }

    /* =========================================
       UPDATE LOCAL ORDER
    ========================================= */

    await supabase
      .from("orders")
      .update({
        courier_id:
          cosmos.data?.id,

        courier_barcode:
          cosmos.data?.barcode,

        integration_barcode:
          cosmos.data?.integrationBarcode,

        courier_status:
          cosmos.data?.status,

        last_sync_at:
          new Date().toISOString(),
      })
      .eq("id", order.id)

    /* =========================================
       SUCCESS
    ========================================= */

    return NextResponse.json({
      success: true,

      order: {
        ...order,

        courier_id:
          cosmos.data?.id,

        courier_barcode:
          cosmos.data?.barcode,

        courier_status:
          cosmos.data?.status,
      },
    })

  } catch (err) {

    console.error(err)

    return NextResponse.json(
      {
        error: "Failed to create order",
      },
      {
        status: 500,
      }
    )
  }
}