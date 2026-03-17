"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type OrderSheetMode = "view" | "create"

interface OrderData {
  id?: string
  name?: string
  number?: string
  city?: string
  adress?: string
  quantity?: number
  nbr_colis?: number
  total?: number
  content?: string
  status?: string
  payment?: string
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    returned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  }

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles] || statusStyles.pending}>
      {status || "pending"}
    </Badge>
  )
}

function PaymentBadge({ payment }: { payment: string }) {
  const paymentStyles = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <Badge className={paymentStyles[payment as keyof typeof paymentStyles] || paymentStyles.unpaid}>
      {payment || "unpaid"}
    </Badge>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
  )
}

function InfoField({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

export function OrderViewSheet({
  order,
  mode = "view",
  children,
}: {
  order?: OrderData
  mode?: OrderSheetMode
  children: React.ReactNode
}) {
  const [formData, setFormData] = useState<OrderData>(
    order || {
      name: "",
      number: "",
      city: "",
      adress: "",
      quantity: 0,
      nbr_colis: 0,
      total: 0,
      content: "",
    }
  )

  const handleInputChange = (
    field: keyof OrderData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    console.log("[v0] Form submitted with data:", formData)
    // TODO: Connect to backend API
  }

  const isViewMode = mode === "view"

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="w-[720px] max-w-[100vw] overflow-y-auto p-0 sm:w-[550px]"
      >
        <div className="flex h-full flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SheetHeader className="space-y-4 px-8 py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <SheetTitle className="text-2xl font-bold">
                    {isViewMode
                      ? `Order #${order?.id?.slice(0, 6)}`
                      : "Nouvelle commande"}
                  </SheetTitle>
                  {!isViewMode && (
                    <p className="text-sm text-muted-foreground">
                      Créer une nouvelle commande client
                    </p>
                  )}
                </div>
              </div>

              {isViewMode && (
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={order?.status || "pending"} />
                  <PaymentBadge payment={order?.payment || "unpaid"} />
                </div>
              )}
            </SheetHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-8 px-8 py-8">
              {/* Client Section */}
              <section className="space-y-4">
                <SectionLabel>Client Information</SectionLabel>

                {isViewMode ? (
                  <div className="grid grid-cols-2 gap-6 rounded-lg bg-muted/40 p-5">
                    <InfoField label="Name" value={order?.name || "—"} />
                    <InfoField label="Phone" value={order?.number || "—"} />
                    <div className="col-span-2">
                      <InfoField label="City" value={order?.city || "—"} />
                    </div>
                    <div className="col-span-2">
                      <InfoField label="Address" value={order?.adress || "—"} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6 rounded-lg bg-muted/40 p-5">
                    <FormField label="Name">
                      <Input
                        placeholder="Client name"
                        value={formData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </FormField>
                    <FormField label="Phone">
                      <Input
                        placeholder="Phone number"
                        value={formData.number || ""}
                        onChange={(e) =>
                          handleInputChange("number", e.target.value)
                        }
                      />
                    </FormField>
                    <div className="col-span-2">
                      <FormField label="City">
                        <Input
                          placeholder="City"
                          value={formData.city || ""}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                        />
                      </FormField>
                    </div>
                    <div className="col-span-2">
                      <FormField label="Address">
                        <Input
                          placeholder="Street address"
                          value={formData.adress || ""}
                          onChange={(e) =>
                            handleInputChange("adress", e.target.value)
                          }
                        />
                      </FormField>
                    </div>
                  </div>
                )}
              </section>

              <Separator className="my-2" />

              {/* Order Section */}
              <section className="space-y-4">
                <SectionLabel>Order Details</SectionLabel>

                {isViewMode ? (
                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/40 p-5">
                    <InfoField label="Quantity" value={order?.quantity || "—"} />
                    <InfoField
                      label="Packages"
                      value={order?.nbr_colis || "—"}
                    />
                    <InfoField
                      label="Total"
                      value={
                        <span className="text-base font-semibold text-primary">
                          ${order?.total || "0"}
                        </span>
                      }
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/40 p-5">
                    <FormField label="Quantity">
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.quantity || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "quantity",
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                      />
                    </FormField>
                    <FormField label="Packages">
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.nbr_colis || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "nbr_colis",
                            e.target.value ? parseInt(e.target.value) : 0
                          )
                        }
                      />
                    </FormField>
                    <FormField label="Total ($)">
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.total || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "total",
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                      />
                    </FormField>
                  </div>
                )}
              </section>

              <Separator className="my-2" />

              {/* Products Section */}
              <section className="space-y-4 pb-20">
                <SectionLabel>Products</SectionLabel>

                {isViewMode ? (
                  <div className="overflow-hidden rounded-lg border border-border bg-muted/30 p-5 text-sm">
                    <div className="whitespace-pre-wrap break-words text-foreground">
                      {order?.content || "No products listed"}
                    </div>
                  </div>
                ) : (
                  <FormField label="Products List">
                    <Textarea
                      placeholder="Enter products list (one per line or comma-separated)"
                      value={formData.content || ""}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      className="min-h-32"
                    />
                  </FormField>
                )}
              </section>
            </div>
          </div>

          {/* Sticky Footer - Only show for create mode */}
          {!isViewMode && (
            <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8 py-4">
              <div className="flex gap-3 justify-end">
                <Button variant="outline" size="default">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  size="default"
                >
                  Créer commande
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
