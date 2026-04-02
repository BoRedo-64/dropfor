import { createClient } from "@/lib/supabase/server"

export async function getOrdersChartData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  // last 7 days
  const today = new Date()
  const last7Days = new Date()
  last7Days.setDate(today.getDate() - 6)

  const { data: orders } = await supabase
    .from("orders")
    .select("created_at, status")
    .eq("user_id", user.id)
    .gte("created_at", last7Days.toISOString())

  const daysMap: any = {}

  // init 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(today.getDate() - i)

    const key = d.toISOString().slice(0, 10)

    daysMap[key] = {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      total: 0,
      returns: 0,
    }
  }

  // fill data
  orders?.forEach((o) => {
    const key = o.created_at.slice(0, 10)

    if (daysMap[key]) {
      daysMap[key].total += 1

      if (o.status === "retour") {
        daysMap[key].returns += 1
      }
    }
  })

  return Object.values(daysMap).reverse()
}