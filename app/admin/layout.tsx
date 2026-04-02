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
  Package,
  Truck,
  PackagePlus,
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [userName, setUserName] = useState("Admin")
  const [initials, setInitials] = useState("A")

  // 🔥 COUNTS
  const [counts, setCounts] = useState({
    pickups: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // 👤 NAME
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

      // 🔥 PICKUPS COUNT (pending only)
      const { data: pickups } = await supabase
        .from("pickups")
        .select("status")

      let pickupsCount = 0

      pickups?.forEach((p) => {
        if (p.status === "pending") pickupsCount++
      })

      setCounts({ pickups: pickupsCount })
    }

    fetchData()
  }, [])

  const sections = [
    {
      title: "Général",
      items: [
        { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      ],
    },
    {
      title: "Gestion",
      items: [
        { title: "Commandes", href: "/admin/orders", icon: ShoppingCart },
        { title: "Ajouter Stock", href: "/admin/stock", icon: PackagePlus },
        {
          title: "Pickups",
          href: "/admin/pickups",
          icon: Truck,
          badge: counts.pickups, // 🔴 ALERT
        },
      ],
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">

        {/* HEADER */}
        <SidebarHeader>
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center">
              <Package className="!h-6 !w-6" />
            </div>

            <span className="text-xl font-semibold hidden md:inline group-data-[collapsible=icon]:hidden">
              Dropfor Admin
            </span>
          </div>
        </SidebarHeader>

        {/* CONTENT */}
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

                          {/* LEFT */}
                          <div className="flex items-center gap-4">
                            <Icon className="!h-5 !w-5" />
                            <span className="group-data-[collapsible=icon]:hidden">
                              {link.title}
                            </span>
                          </div>

                          {/* 🔴 BADGE */}
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

        {/* FOOTER */}
        <SidebarFooter className="border-t">
          <div className="flex items-center gap-3 px-4 py-4">

            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>

            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">
                Administrateur
              </p>
            </div>

          </div>
        </SidebarFooter>

      </Sidebar>

      {/* PAGE */}
      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>

    </SidebarProvider>
  )
}
