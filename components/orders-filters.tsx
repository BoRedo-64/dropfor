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
import { STATUS_CONFIG } from "@/lib/status" // 🔥 NEW

export function OrdersFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const [search, setSearch] = useState(params.get("search") || "")
  const [status, setStatus] = useState(params.get("status") || "")
  const [payment, setPayment] = useState(params.get("payment") || "")
  const [city, setCity] = useState(params.get("city") || "")

  function updateParams(next: Record<string, string>) {
    const newParams = new URLSearchParams(params.toString())

    Object.entries(next).forEach(([key, value]) => {
      if (!value) newParams.delete(key)
      else newParams.set(key, value)
    })

    newParams.set("page", "1")

    router.push(`/account/orders?${newParams.toString()}`)
  }

  // debounce search
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

      {/* 🔥 STATUS (DYNAMIC) */}
      <Select
        value={status || undefined}
        onValueChange={(v) => {
          setStatus(v)
          updateParams({ status: v })
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STATUS_CONFIG).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 🔥 PAYMENT (MATCH DB) */}
      <Select
        value={payment || undefined}
        onValueChange={(v) => {
          setPayment(v)
          updateParams({ payment: v })
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Paiement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="payé">Payé</SelectItem>
          <SelectItem value="non payé">Non payé</SelectItem>
        </SelectContent>
      </Select>

      {/* CITY (keep simple for now) */}
      <Select
        value={city || undefined}
        onValueChange={(v) => {
          setCity(v)
          updateParams({ city: v })
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Ville" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Tunis">Tunis</SelectItem>
          <SelectItem value="Sfax">Sfax</SelectItem>
          <SelectItem value="Sousse">Sousse</SelectItem>
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

          router.push("/account/orders?page=1")
        }}
      >
        Reset
      </Button>

    </div>
  )
}
