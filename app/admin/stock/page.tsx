"use client"

import { useState } from "react"
import { Scanner } from "@yudiel/react-qr-scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Camera, Loader2 } from "lucide-react"

export default function StockPage() {
  const [orderNumber, setOrderNumber] = useState("")
  const [scanning, setScanning] = useState(false)
  const [loading, setLoading] = useState(false)

  async function updateOrder(number: string) {
    if (!number) return

    try {
      setLoading(true)

      const res = await fetch("/api/admin/stock", {
        method: "POST",
        body: JSON.stringify({ order_number: number }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Erreur")
        return
      }

      alert("✅ Commande ajoutée au dépôt")

      setOrderNumber("")
    } catch (err) {
      console.error(err)
      alert("Erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-10 flex justify-center">
      <div className="w-full max-w-xl">

        <Card>
          <CardHeader>
            <CardTitle>Ajouter au dépôt</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* INPUT */}
            <div className="space-y-2">
              <Input
                placeholder="Numéro de commande"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />

              <Button
                onClick={() => updateOrder(orderNumber)}
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Valider
              </Button>
            </div>

            {/* CAMERA BUTTON */}
            <Button
              onClick={() => setScanning(true)}
              className="w-full flex items-center gap-2"
              variant="secondary"
            >
              <Camera className="h-5 w-5" />
              Scanner avec la caméra
            </Button>

          </CardContent>
        </Card>

        {/* SCANNER MODAL STYLE */}
        {scanning && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">

            <div className="bg-white rounded-lg overflow-hidden w-full max-w-md">

              <div className="p-4 border-b flex justify-between items-center">
                <p className="font-medium">Scanner QR Code</p>

                <button
                  onClick={() => setScanning(false)}
                  className="text-sm text-muted-foreground"
                >
                  Fermer
                </button>
              </div>

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

              <div className="p-4">
                <Button
                  onClick={() => setScanning(false)}
                  variant="destructive"
                  className="w-full"
                >
                  Arrêter
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}
