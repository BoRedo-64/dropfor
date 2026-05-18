import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

import {
  getOrder,
  cosmosStatusMap,
} from "@/lib/integrations/cosmos"

export async function GET(req: Request) {
  try {

    /* =========================================
       SECRET PROTECTION
    ========================================= */

    const authHeader =
      req.headers.get("authorization")

    if (
      authHeader !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      )
    }

    const supabase = await createClient()

    /* =========================================
       GET ACTIVE ORDERS
    ========================================= */

    const { data: orders, error } =
      await supabase
        .from("orders")
        .select("*")
        .not("courier_barcode", "is", null)
        .not("status", "in", "(livré,retour)")
        .limit(100)

    if (error) {
      throw error
    }

    if (!orders?.length) {
      return NextResponse.json({
        success: true,
        message: "No orders to sync",
      })
    }

    let updated = 0

    /* =========================================
       LOOP ORDERS
    ========================================= */

    for (const order of orders) {

      try {

        const cosmos = await getOrder(
          order.courier_barcode
        )

        if (
          !cosmos.success ||
          !cosmos.data
        ) {
          continue
        }

        const courierStatus =
          cosmos.data.status

        const localStatus =
          cosmosStatusMap[
            courierStatus
          ] || order.status

        /* =========================================
           UPDATE ONLY IF STATUS CHANGED
        ========================================= */

        if (
          localStatus !== order.status
        ) {

          await supabase
            .from("orders")
            .update({
              status: localStatus,

              courier_status:
                courierStatus,

              last_sync_at:
                new Date()
                  .toISOString(),
            })
            .eq("id", order.id)

          updated++

          console.log(
            `UPDATED ${order.id}: ${order.status} → ${localStatus}`
          )
        }

      } catch (err) {

        console.error(
          "SYNC ORDER ERROR:",
          order.id,
          err
        )
      }
    }

    return NextResponse.json({
      success: true,
      synced: orders.length,
      updated,
    })

  } catch (err) {

    console.error(err)

    return NextResponse.json(
      {
        error: "Sync failed",
      },
      {
        status: 500,
      }
    )
  }
}