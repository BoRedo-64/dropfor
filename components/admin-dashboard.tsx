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
  total: number
  status: string
  payment: string
  created_at: string
  profiles: {
    first_name: string | null
    last_name: string | null
  } | null
}

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

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
    const delay = setTimeout(() => {
      fetchOrders()
    }, 300)

    return () => clearTimeout(delay)
  }, [search])

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Delete this order?")
    if (!confirmDelete) return

    await fetch("/api/admin/orders", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    fetchOrders()
  }

  return (
    <div className="container mx-auto py-8 px-4">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Admin Orders</h1>
        <p className="text-muted-foreground">
          Manage all platform orders
        </p>
      </div>

      {/* Search */}
      <div className="mb-4 relative w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search by user name..."
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
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">

                <td className="p-3 text-xs text-muted-foreground">
                  #{order.order_number}
                </td>

                <td className="p-3">
                  {order.profiles
                    ? `${order.profiles.first_name ?? ""} ${order.profiles.last_name ?? ""}`
                    : "—"}
                </td>

                <td className="p-3 font-medium">{order.name}</td>
                <td className="p-3">{order.number}</td>
                <td className="p-3">{order.city}</td>
                <td className="p-3 font-medium">${order.total}</td>

                <td className="p-3">
                  <Badge>{order.status}</Badge>
                </td>

                <td className="p-3">
                  <Badge variant="secondary">{order.payment}</Badge>
                </td>

                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
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
            ))}
          </tbody>

        </table>

        {orders.length === 0 && !loading && (
          <div className="text-center py-10 text-muted-foreground">
            No orders found
          </div>
        )}
      </div>

    </div>
  )
}