"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function DeleteOrderButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    const confirmDelete = confirm("Delete this order?")

    if (!confirmDelete) return

    await fetch("/api/orders/delete", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-muted-foreground hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}