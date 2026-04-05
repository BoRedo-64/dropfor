"use client"

import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Printer } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function PickupsTable({ pickups }: { pickups: any[] }) {
  const router = useRouter()
  const supabase = createClient()

  async function handlePrint(pickupId: string, e: React.MouseEvent) {
    e.stopPropagation()

    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("pickup_id", pickupId)

    if (!orders || orders.length === 0) {
      alert("No orders in this pickup")
      return
    }

    // get first order user (all orders same user anyway)
    const userId = orders[0].user_id

    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone, adresse")
      .eq("id", userId)
      .single()
    
    const QRCode = await import("qrcode")

    const win = window.open("", "_blank")
    if (!win) return

    const pages: string[] = []

    for (let order of orders) {
      const qr = await QRCode.toDataURL(`ORDER-${order.order_number}`)

      pages.push(`
        <div class="page">
          <div class="container">

            <!-- HEADER -->
            <div class="header">
              <div class="header-left">
                <img src="/logo.jpg" class="logo" />
                <div class="company-info">
                  <div>DROPFOR GROUP</div>
                  <div>RUE TAHRAN RAOUED ARIANA</div>
                  <div>M/F:</div>
                </div>
              </div>

              <div class="header-center">
                <div class="depot-label">Depot</div>
                <div class="city-name">${order.city}</div>
              </div>

              <div class="header-right">
                <div class="date-line">Date: ${new Date().toLocaleDateString("fr-FR")}</div>
                <div><span class="label">Expéditeur:</span> ${profile ? `${profile.first_name || ""} ${profile.last_name || ""}` : ""}</div>
                <div><span class="label">Adresse:</span> ${profile?.adresse || ""}</div>
                <div><span class="label">Téléphone:</span> ${profile?.phone || ""}</div>
              </div>
            </div>

            <!-- QR + CITY -->
            <div class="mid-section">
              <div class="city-big">${order.city}</div>
              <img src="${qr}" class="qr" />
            </div>

            <!-- BON DE LIVRAISON TITLE -->
            <div class="bon-title">
              BON DE LIVRAISON N° ${order.order_number}
            </div>

            <!-- INFO BOXES -->
            <div class="info-row">
              <div class="info-box">
                <div class="info-line"><span class="label">Date BLF:</span> ${new Date().toLocaleDateString("fr-FR")}</div>
                <div class="info-line destination-line"><span class="label">Destination:</span> <strong>${order.city}</strong></div>
              </div>

              <div class="info-box">
                <div class="info-line"><span class="label">Destinataire:</span> ${order.name}</div>
                <div class="info-line"><span class="label">Adresse:</span> ${order.adress}</div>
                <div class="info-line"><span class="label">Téléphone:</span> ${order.number}</div>
              </div>
            </div>

            <!-- PRODUCT TABLE -->
            <table class="product-table">
              <thead>
                <tr>
                  <th class="col-desig">DÉSIGNATION - CONTENU DU COLIS</th>
                  <th class="col-qty">QUANTITÉ</th>
                  <th class="col-price">MONTANT TTC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${order.content || "Produit"}</td>
                  <td class="center">${order.quantity || 1}</td>
                  <td class="center">${order.total} DT</td>
                </tr>
              </tbody>
            </table>

            <!-- INSTRUCTIONS -->
            <div class="instructions-section">
              <div class="instructions-title">Instructions diverses</div>
              <div class="instructions-body">
                <em>Ouvrir colis: OUI</em>
              </div>
            </div>

          </div>
        </div>
      `)
    }

    win.document.write(`
      <html>
        <head>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              font-family: Arial, sans-serif;
              background: white;
              color: #000;
            }

            .page {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              padding: 12mm;
              page-break-after: always;
            }

            .container {
              padding: 14px;
              display: flex;
              flex-direction: column;
              gap: 12px;
              min-height: 273mm;
            }

            /* HEADER */
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 10px;
            }

            .header-left {
              display: flex;
              flex-direction: column;
              gap: 6px;
              flex: 1;
            }

            .logo {
              width: 70px;
            }

            .company-info {
              font-size: 9px;
              color: #333;
              line-height: 1.5;
            }

            .header-center {
              flex: 1;
              text-align: center;
            }

            .depot-label {
              font-size: 11px;
              color: #555;
            }

            .city-name {
              font-size: 22px;
              font-weight: bold;
              margin-top: 2px;
            }

            .header-right {
              flex: 1;
              text-align: right;
              font-size: 11px;
              line-height: 1.8;
            }

            .label {
              font-weight: bold;
            }

            /* MID SECTION */
            .mid-section {
              border: 1px solid #000;
              border-radius: 4px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 14px 18px;
            }

            .city-big {
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 1px;
            }

            .qr {
              width: 90px;
              height: 90px;
            }

            /* BON TITLE */
            .bon-title {
              border: 1px solid #000;
              border-radius: 4px;
              padding: 10px;
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              letter-spacing: 0.5px;
            }

            /* INFO BOXES */
            .info-row {
              display: flex;
              gap: 10px;
            }

            .info-box {
              flex: 1;
              border: 1px solid #000;
              border-radius: 4px;
              padding: 10px 12px;
              font-size: 12px;
              line-height: 2;
            }

            .info-line {
              display: flex;
              gap: 4px;
            }

            .destination-line strong {
              font-size: 16px;
            }

            /* PRODUCT TABLE */
            .product-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }

            .product-table th,
            .product-table td {
              border: 1px solid #000;
              padding: 9px 12px;
            }

            .product-table thead tr {
              background: #f0f0f0;
            }

            .product-table th {
              font-weight: bold;
              font-size: 11px;
            }

            .col-desig { width: auto; }
            .col-qty { width: 100px; text-align: center; }
            .col-price { width: 110px; text-align: center; }

            .product-table td.center {
              text-align: center;
            }

            /* INSTRUCTIONS */
            .instructions-section {
              border: 1px solid #000;
              border-radius: 4px;
              overflow: hidden;
              margin-top: auto;
            }

            .instructions-title {
              text-align: center;
              font-weight: bold;
              font-size: 12px;
              padding: 8px;
              border-bottom: 1px solid #000;
            }

            .instructions-body {
              padding: 12px 16px;
              font-size: 12px;
              min-height: 50px;
              display: flex;
              align-items: center;
            }

            @media print {
              body { margin: 0; }
              .page {
                margin: 0;
                padding: 10mm;
                width: 210mm;
              }
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
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm">

        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">Pickup</th>
            <th className="p-3 text-left">Orders</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {pickups.map((pickup) => {
            const orderCount = pickup.orders?.length || 0

            const statusStyle =
              pickup.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : pickup.status === "accepted"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"

            return (
              <tr
                key={pickup.id}
                className="border-t cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/account/pickups/${pickup.id}`)}
              >
                <td className="p-3 font-medium">
                  #{pickup.id.slice(0, 8)}
                </td>

                <td className="p-3">
                  {orderCount} orders
                </td>

                <td className="p-3">
                  <Badge className={statusStyle}>
                    {pickup.status}
                  </Badge>
                </td>

                <td className="p-3">
                  {new Date(pickup.created_at).toLocaleDateString("fr-FR")}
                </td>

                <td className="p-3">
                  <button
                    onClick={(e) => handlePrint(pickup.id, e)}
                    className="w-8 h-8 rounded-lg bg-black flex items-center justify-center hover:bg-gray-800 transition"
                  >
                    <Printer className="h-4 w-4 text-white" />
                  </button>
                </td>

              </tr>
            )
          })}
        </tbody>

      </table>
    </div>
  )
}