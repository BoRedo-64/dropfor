"use client"

import { Trash2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function DeleteOrderButton({
  id,
  page,
}: {
  id: string
  page: number
}) {
  const router = useRouter()
  const params = useSearchParams()

  async function handleDelete() {
    const confirmDelete = confirm("Delete this order?")
    if (!confirmDelete) return

    await fetch("/api/orders/delete", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    // ✅ check if current page might become empty
    const currentParams = new URLSearchParams(params.toString())
    const currentPage = Number(currentParams.get("page") || "1")

    // if we're not on first page → go back one page
    if (currentPage > 1) {
      currentParams.set("page", String(currentPage - 1))
      router.push(`/account/orders?${currentParams.toString()}`)
    } else {
      router.refresh()
    }
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
