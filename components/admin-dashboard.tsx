
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
  profiles: {
    first_name: string | null
    last_name: string | null
  } | null
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
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  async function fetchOrders() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/orders?search=${search}`)
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
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

  // 🖨 BULK PRINT (UPDATED DESIGN)
  function handleBulkPrint() {
    const selectedOrders = orders.filter(o => selected.includes(o.id))
    if (selectedOrders.length === 0) return

    const win = window.open("", "_blank")
    if (!win) return

    const pages = []

    for (let i = 0; i < selectedOrders.length; i += 2) {
      const chunk = selectedOrders.slice(i, i + 2)

      const labels = chunk.map(order => `
        <div class="label">

          <div class="header">
            <div class="sender">EXPÉDITEUR: ${order.profiles
                      ? `${order.profiles.first_name ?? ""} ${order.profiles.last_name ?? ""}`
                      : "—"}</div>
            <div class="order">Commande #: ${order.order_number}</div>
          </div>

          <div class="section">
            <div><b>Nom:</b> ${order.name}</div>
            <div><b>Téléphone:</b> ${order.number}</div>
            <div><b>Ville:</b> ${order.city}</div>
            <div><b>Adresse:</b> ${order.adress}</div>
          </div>

          <div class="bottom">${order.total} DT</div>
        </div>
      `).join("")

      pages.push(`
        <div class="page">
          ${labels}
        </div>
      `)
    }

    win.document.write(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial;
              margin: 0;
            }

            .page {
              height: 100vh;
              display: flex;
              flex-direction: column;
              page-break-after: always;
            }

            .label {
              height: 50vh;
              border: 2px solid black;
              padding: 20px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }

            .header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              font-size: 14px;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }

            .sender {
              text-transform: uppercase;
            }

            .order {
              font-size: 14px;
            }

            .section {
              font-size: 16px;
              line-height: 1.6;
            }

            .bottom {
              text-align: right;
              font-weight: bold;
              font-size: 18px;
            }
          </style>
        </head>

        <body>
          ${pages.join("")}

          <script>
            window.onload = () => {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `)

    win.document.close()
  }

  return (
    <div className="container mx-auto py-8 px-4">

      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Orders</h1>
          <p className="text-muted-foreground">Manage all platform orders</p>
        </div>

        <button
          onClick={handleBulkPrint}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Print Selected
        </button>
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

      {/* Table (unchanged) */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-muted/50">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelected(e.target.checked ? orders.map(o => o.id) : [])
                  }
                />
              </th>
              <th className="p-3">ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Client</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City</th>
              <th className="p-3">Adress</th>
              <th className="p-3">Total</th>
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

                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(order.id)}
                      onChange={(e) =>
                        setSelected(prev =>
                          e.target.checked
                            ? [...prev, order.id]
                            : prev.filter(id => id !== order.id)
                        )
                      }
                    />
                  </td>

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
