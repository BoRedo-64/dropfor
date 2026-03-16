"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { Search } from "lucide-react"

export function OrdersFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const [search, setSearch] = useState(params.get("search") || "")
  const [status, setStatus] = useState(params.get("status") || "")
  const [payment, setPayment] = useState(params.get("payment") || "")
  const [city, setCity] = useState(params.get("city") || "")

  function updateParams(next: Record<string, string>) {
    const newParams = new URLSearchParams(params)

    Object.entries(next).forEach(([key, value]) => {
      if (!value) newParams.delete(key)
      else newParams.set(key, value)
    })

    router.push(`/account/orders?${newParams.toString()}`)
  }

  // debounce search so it doesn't lag
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ search })
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="flex gap-3 mb-6 flex-wrap">

      {/* Search */}
      <div className="relative w-[260px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Filtrer les commandes..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Status */}
      <Select
        value={status}
        onValueChange={(v) => {
          setStatus(v)
          updateParams({ status: v })
        }}
      >
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

      {/* Payment */}
      <Select
        value={payment}
        onValueChange={(v) => {
          setPayment(v)
          updateParams({ payment: v })
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Paiement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="unpaid">Unpaid</SelectItem>
        </SelectContent>
      </Select>

      {/* City */}
      <Select
        value={city}
        onValueChange={(v) => {
          setCity(v)
          updateParams({ city: v })
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tunis">Tunis</SelectItem>
          <SelectItem value="sfax">Sfax</SelectItem>
          <SelectItem value="sousse">Sousse</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear */}
      <Button
        variant="outline"
        onClick={() => {
          setSearch("")
          setStatus("")
          setPayment("")
          setCity("")
          router.push("/account/orders")
        }}
      >
        Clear filters
      </Button>

    </div>
  )
}