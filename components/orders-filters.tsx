"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

export function OrdersFilters() {
  const router = useRouter()
  const params = useSearchParams()

  function updateParam(key: string, value: string) {
    const newParams = new URLSearchParams(params)

    if (!value) newParams.delete(key)
    else newParams.set(key, value)

    router.push(`/account/orders?${newParams.toString()}`)
  }

  return (
    <div className="flex gap-3 mb-6 flex-wrap">

      <div className="relative w-[260px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrer les commandes..."
          className="pl-9"
          onChange={(e) => updateParam("search", e.target.value)}
        />
      </div>

      <Select onValueChange={(v) => updateParam("status", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="returned">Returned</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => updateParam("payment", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Paiement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => updateParam("city", v)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tunis">Tunis</SelectItem>
          <SelectItem value="sfax">Sfax</SelectItem>
          <SelectItem value="sousse">Sousse</SelectItem>
        </SelectContent>
      </Select>

    </div>
  )
}