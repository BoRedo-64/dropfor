'use client'

import { usePathname } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import Link from 'next/link'

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar'

import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  AlertTriangle,
  Clock,
  RotateCcw,
  Headphones,
  CheckCircle,
  Truck,
  Megaphone,
} from 'lucide-react'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [userName, setUserName] = useState("User")
  const [initials, setInitials] = useState("U")

  const [counts, setCounts] = useState({
    pending: 0,
    returns: 0,
    check: 0,
    payments: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const firstName = user.user_metadata?.first_name || ""
      const lastName = user.user_metadata?.last_name || ""

      const fullName = `${firstName} ${lastName}`.trim()

      if (fullName) {
        setUserName(fullName)

        const initials = fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()

        setInitials(initials)
      }

    // 📦 ORDERS COUNTS
    const { data: orders } = await supabase
      .from("orders")
      .select("status")

    let pending = 0
    let returns = 0
    let check = 0

    orders?.forEach((o) => {
      if (o.status === "en attente") pending++
      if (o.status === "retour") returns++
      if (o.status === "a verifier") check++
    })

    // 💰 PAYMENTS COUNT (IMPORTANT FIX)
    const { count: paymentsCount } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "non reçu")

    setCounts({
      pending,
      returns,
      check,
      payments: paymentsCount || 0,
    })
    }

    fetchData()
  }, [])

  const sections = [
    {
      title: "Général",
      items: [
        { title: "Tableau de bord", href: "/account", icon: LayoutDashboard },
      ],
    },
    {
      title: "Commandes",
      items: [
        { title: "Toutes les commandes", href: "/account/orders", icon: ShoppingCart },
        { title: "À vérifier", href: "/account/check", icon: AlertTriangle, badge: counts.check },
        { title: "Retour", href: "/account/returns", icon: RotateCcw, badge: counts.returns },
      ],
    },
    {
      title: "Collecte",
      items: [
        { title: "Commandes en attente", href: "/account/pending", icon: Clock, badge: counts.pending },
        { title: "Pickup", href: "/account/pickups", icon: Package },
      ],
    },

    // ✅ RESTORED SERVICES
    {
      title: "Services",
      items: [
        { title: "Confirmations", href: "/account/confirmation", icon: CheckCircle },
        { title: "Fulfillment", href: "/account/fulfillment", icon: Truck },
        { title: "Marketing", href: "/account/marketing", icon: Megaphone },
      ],
    },

    {
      title: "Finance",
      items: [
        { title: "Paiement", href: "/account/payments", icon: CreditCard, badge: counts.payments },
      ],
    },
    {
      title: "Support",
      items: [
        { title: "Service Client", href: "/account/support", icon: Headphones },
      ],
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">

        <SidebarHeader>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center">
              <Package className="!h-6 !w-6" />
            </div>

            <span className="text-xl font-semibold hidden md:inline group-data-[collapsible=icon]:hidden">
              Dropfor
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">

          {sections.map((section) => (
            <div key={section.title} className="mb-6">

              <p className="text-[10px] font-semibold text-muted-foreground px-4 mb-2 uppercase tracking-wide">
                {section.title}
              </p>

              <SidebarMenu>
                {section.items.map((link) => {
                  const isActive = pathname === link.href
                  const Icon = link.icon

                  return (
                    <SidebarMenuItem key={link.href}>

                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={link.title}
                        className="h-9 text-sm"
                      >

                        <Link
                          href={link.href}
                          className="flex items-center justify-between px-4 w-full"
                        >

                          <div className="flex items-center gap-4">
                            <Icon className="!h-5 !w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              {link.title}
                            </span>
                          </div>

                          {link.badge > 0 && (
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                              {link.badge}
                            </span>
                          )}

                        </Link>

                      </SidebarMenuButton>

                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>

            </div>
          ))}

        </SidebarContent>

        <SidebarFooter className="border-t">
          <div className="flex items-center gap-3 px-4 py-4">

            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>

            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">
                Expéditeur
              </p>
            </div>

          </div>
        </SidebarFooter>

      </Sidebar>

      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>

    </SidebarProvider>
  )
}
