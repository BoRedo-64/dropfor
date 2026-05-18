import { createClient } from "@/lib/supabase/server"

import {
  getOrder,
  cosmosStatusMap,
} from "@/lib/integrations/cosmos"

export async function syncCosmosOrders() {

  const supabase = await createClient()

  const { data: orders, error } =
    await supabase
      .from("orders")
      .select("*")
      .not("courier_barcode", "is", null)
      .not("status", "eq", "livré")
      .not("status", "eq", "retour")
      .limit(100)

  if (error) {
    throw error
  }

  if (!orders?.length) {
    return {
      success: true,
      synced: 0,
      updated: 0,
    }
  }

  let updated = 0

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
      }

    } catch (err) {

      console.error(
        "SYNC ERROR:",
        order.id,
        err
      )
    }
  }

  return {
    success: true,
    synced: orders.length,
    updated,
  }
}