"use client"

import { useState } from "react"
import { Scanner } from "@yudiel/react-qr-scanner"

export default function StockPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [scanning, setScanning] = useState(false)

  async function updateOrder(number: string) {
    if (!number) return

    await fetch("/api/admin/stock", {
      method: "POST",
      body: JSON.stringify({ order_number: number }),
    })

    alert("✅ Order moved to dépôt")
  }

  return (
    <div className="space-y-6 max-w-xl">

      <h1 className="text-2xl font-bold">Ajouter Stock</h1>

      {/* INPUT */}
      <div className="space-y-2">
        <input
          placeholder="Numéro de commande"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="border rounded-md p-2 w-full"
        />

        <button
          onClick={() => updateOrder(orderNumber)}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Valider
        </button>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => setScanning(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Scanner QR Code
      </button>

      {/* CAMERA */}
      {scanning && (
        <div className="mt-4 border rounded-md overflow-hidden">

          <Scanner
            onScan={(result) => {
              if (result?.[0]?.rawValue) {
                const text = result[0].rawValue

                let number = text

                if (text.startsWith("ORDER-")) {
                  number = text.replace("ORDER-", "")
                }

                updateOrder(number)
                setScanning(false)
              }
            }}
            onError={(err) => console.log(err)}
            constraints={{ facingMode: "environment" }}
            styles={{
              container: { width: "100%" },
              video: {
                width: "100%",
                height: "300px",
                objectFit: "cover",
              },
            }}
          />

          <button
            onClick={() => setScanning(false)}
            className="w-full bg-red-500 text-white py-2"
          >
            Stop
          </button>

        </div>
      )}

    </div>
  )
}
