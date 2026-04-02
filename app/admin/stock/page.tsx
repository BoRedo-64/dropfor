"use client"

import { useState } from "react"
import { QrReader } from "react-qr-reader"

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

      {/* 🔢 MANUAL INPUT */}
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

      {/* 📷 SCAN BUTTON */}
      <button
        onClick={() => setScanning(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Scanner QR Code
      </button>

      {/* 📷 CAMERA */}
      {scanning && (
        <div className="mt-4 border rounded-md overflow-hidden">

          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={(result, error) => {
              if (!!result) {
                const text = result.getText()

                const number = text.replace("ORDER-", "")

                updateOrder(number)

                setScanning(false) // stop camera
              }
            }}
            style={{ width: "100%" }}
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
