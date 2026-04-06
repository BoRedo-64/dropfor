"use client"

import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { Eye, Pencil, Trash2, Search } from "lucide-react"

type Order = {
id: string
order_number: number
name: string
number: string
city: string
adress: string
total: number
status: string
payment: string
created_at: string
quantity?: number
livreur_id?: string | null // ✅ NEW
profiles: {
first_name: string | null
last_name: string | null
} | null
}

type Livreur = {
id: string
first_name: string | null
last_name: string | null
}

const statusConfig: Record<string, { label: string; className: string }> = {
"en attente": { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
"au depot": { label: "Au dépôt", className: "bg-gray-100 text-gray-800" },
"en cours": { label: "En cours", className: "bg-blue-100 text-blue-800" },
"livré": { label: "Livré", className: "bg-green-100 text-green-800" },
"retour": { label: "Retour", className: "bg-red-100 text-red-800" },
}

export function AdminDashboard() {
const [orders, setOrders] = useState<Order[]>([])
const [livreurs, setLivreurs] = useState<Livreur[]>([]) // ✅ NEW
const [search, setSearch] = useState("")
const [loading, setLoading] = useState(false)

async function fetchOrders() {
try {
setLoading(true)


  const res = await fetch(`/api/admin/orders?search=${search}`)
  const data = await res.json()
  setOrders(Array.isArray(data) ? data : [])

  const resLivreurs = await fetch("/api/admin/livreurs")

  let dataLivreurs = []
  try {
    dataLivreurs = await resLivreurs.json()
  } catch (e) {
    console.error("Livreurs API error")
  }

  setLivreurs(Array.isArray(dataLivreurs) ? dataLivreurs : [])

} catch (err) {
  console.error(err)
  setOrders([])
} finally {
  setLoading(false)
}


}

useEffect(() => {
const delay = setTimeout(fetchOrders, 300)
return () => clearTimeout(delay)
}, [search])

async function handleDelete(id: string) {
if (!confirm("Delete this order?")) return

await fetch("/api/admin/orders", {
  method: "DELETE",
  body: JSON.stringify({ id }),
})

fetchOrders()


}

// ✅ ASSIGN LIVREUR
async function handleAssign(orderId: string, livreurId: string) {
await fetch("/api/admin/orders/assign-livreur", {
method: "POST",
body: JSON.stringify({ orderId, livreurId }),
})

setOrders((prev) =>
  prev.map((o) =>
    o.id === orderId ? { ...o, livreur_id: livreurId } : o
  )
)


}

return ( <div className="container mx-auto py-8 px-4">

  {/* Header */}
  <div className="mb-6">
    <h1 className="text-3xl font-bold">All Orders</h1>
    <p className="text-muted-foreground">Manage all platform orders</p>
  </div>

  {/* Search */}
  <div className="mb-4 relative w-[300px]">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search..."
      className="pl-9"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {/* Table */}
  <div className="rounded-md border overflow-x-auto">
    <table className="w-full text-sm">

      <thead className="bg-muted/50">
        <tr>
          <th className="p-3">ID</th>
          <th className="p-3">User</th>
          <th className="p-3">Client</th>
          <th className="p-3">Phone</th>
          <th className="p-3">City</th>
          <th className="p-3">Adress</th>
          <th className="p-3">Total</th>
          <th className="p-3">Livreur</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {orders.map(order => {
          const config = statusConfig[order.status] || {
            label: order.status,
            className: "bg-gray-100 text-gray-800",
          }

          return (
            <tr key={order.id} className="border-t">

              <td className="p-3">#{order.order_number}</td>

              <td className="p-3">
                {order.profiles
                  ? `${order.profiles.first_name ?? ""} ${order.profiles.last_name ?? ""}`
                  : "—"}
              </td>

              <td className="p-3">{order.name}</td>
              <td className="p-3">{order.number}</td>
              <td className="p-3">{order.city}</td>
              <td className="p-3">{order.adress}</td>
              <td className="p-3">${order.total}</td>

              {/* ✅ LIVREUR SELECT */}
              <td
                className="p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={order.livreur_id || ""}
                  onChange={(e) =>
                    handleAssign(order.id, e.target.value)
                  }
                >
                  <option value="">Assign</option>

                  {livreurs.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.first_name} {l.last_name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="p-3">
                <Badge className={config.className}>
                  {config.label}
                </Badge>
              </td>

              <td className="p-3">
                <div className="flex items-center gap-3">
                  <button className="text-muted-foreground hover:text-primary">
                    <Eye className="h-4 w-4" />
                  </button>

                  <button className="text-muted-foreground hover:text-blue-600">
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>

            </tr>
          )
        })}
      </tbody>

    </table>
  </div>
</div>

)
}
