"use client"

import { Trash2 } from "lucide-react"

export function DeleteOrderButton({
  orderId,
}: {
  orderId: string
}) {
  const handleDelete = async () => {
    const confirmed = confirm(
      "Delete this order?"
    )

    if (!confirmed) return

    try {
      const res = await fetch(
        "/api/orders/delete",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: orderId,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        alert(
          data.error ||
          "Failed to delete order"
        )

        return
      }

      window.location.reload()

    } catch (err) {
      console.error(err)

      alert("Server error")
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-600 h-6 w-6 flex items-center justify-center"
    >

      <Trash2 className="h-4 w-4" />

    </button>
  )
}