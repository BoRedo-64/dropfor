"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function OrderViewSheet({
  order,
  children,
}: {
  order: any
  children: React.ReactNode
}) {
  return (
    <Sheet>

      {/* THIS MAKES THE EYE ICON VISIBLE AND CLICKABLE */}
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent side="right" className="w-[720px] max-w-[100vw] overflow-y-auto p-0">
        <div className="px-8 py-6 space-y-8">
        {/* Header */}
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold">
            Order #{order.id.slice(0, 6)}
          </SheetTitle>

          <div className="flex gap-2 mt-2">
            <Badge
              className={
                order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "returned"
                  ? "bg-red-100 text-red-700"
                  : order.status === "shipped"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            >
              {order.status || "pending"}
            </Badge>

            <Badge
              className={
                order.payment === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {order.payment || "unpaid"}
            </Badge>
          </div>
        </SheetHeader>

        <Separator className="mb-6" />

        {/* Client */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase">
            Client
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{order.name}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Phone</p>
              <p>{order.number}</p>
            </div>

            <div>
              <p className="text-muted-foreground">City</p>
              <p>{order.city}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Address</p>
              <p>{order.adress}</p>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Order */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase">
            Order
          </h3>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Quantity</p>
              <p className="font-medium">{order.quantity}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Colis</p>
              <p className="font-medium">{order.nbr_colis}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-semibold">${order.total}</p>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Products */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase">
            Products
          </h3>

          <div className="bg-muted rounded-lg p-4 text-sm border">
            {order.content}
          </div>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}