"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Printer } from "lucide-react"

type Order = any

export function PendingTable({
  orders,
  senderName,
}: {
  orders: any[]
  senderName: string
}) {
  const [selected, setSelected] = useState<string[]>([])

  async function handleBulkPrint() {
    const selectedOrders = orders.filter(o => selected.includes(o.id))
    if (selectedOrders.length === 0) return

    const QRCode = await import("qrcode")

    const win = window.open("", "_blank")
    if (!win) return

    const pages = []

    for (let i = 0; i < selectedOrders.length; i += 2) {
      const chunk = selectedOrders.slice(i, i + 2)

      const labels = await Promise.all(
        chunk.map(async (order) => {
          const qr = await QRCode.toDataURL(`ORDER-${order.order_number}`)

          return `
            <div class="label">

              <div class="header">
                <img src="/logo.png" />
                <div>EXPÉDITEUR: ${senderName}</div>
                <div>Commande #: ${order.order_number}</div>
              </div>

              <div class="section">
                <div><b>Nom:</b> ${order.name}</div>
                <div><b>Téléphone:</b> ${order.number}</div>
                <div><b>Ville:</b> ${order.city}</div>
                <div><b>Adresse:</b> ${order.adress}</div>
              </div>

              <div class="qr">
                <img src="${qr}" />
              </div>

              <div class="bottom">${order.total} DT</div>
            </div>
          `
        })
      )

      pages.push(`
        <div class="page">
          ${labels.join("")}
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
              border-bottom: 1px solid black;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }

            .section {
              font-size: 16px;
              line-height: 1.6;
            }

            .qr {
              display: flex;
              justify-content: center;
              margin-top: 10px;
            }

            .qr img {
              width: 120px;
              height: 120px;
            }

            .bottom {
              text-align: right;
              font-weight: bold;
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

  async function handlePickupRequest() {
    if (selected.length === 0) {
      alert("Sélectionnez au moins une commande")
      return
    }

    const confirmPickup = confirm(
      `Demander un pickup pour ${selected.length} commandes ?`
    )

    if (!confirmPickup) return

    try {
      const res = await fetch("/api/pickups", {
        method: "POST",
        body: JSON.stringify({
          orderIds: selected,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Erreur")
        return
      }

      alert("Pickup demandé avec succès ✅")
      setSelected([])
      window.location.reload()

    } catch (err) {
      console.error(err)
      alert("Erreur serveur")
    }
  }

  return (
    <div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mb-4">

        <button
          onClick={handlePickupRequest}
          className="px-4 py-2 border rounded hover:bg-muted"
        >
          Demander pickup
        </button>

        <button
          onClick={handleBulkPrint}
          className="px-4 py-2 bg-black text-white rounded flex items-center justify-center"
        >
          <Printer className="h-5 w-5" />
        </button>

      </div>

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
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Colis</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
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

                <td className="p-3 font-medium">{order.name}</td>
                <td className="p-3">{order.number}</td>
                <td className="p-3">{order.city}</td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">{order.nbr_colis}</td>
                <td className="p-3 font-medium">${order.total}</td>

                <td className="p-3">
                  <Badge className="bg-yellow-100 text-yellow-700">
                    {order.status}
                  </Badge>
                </td>

                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}
