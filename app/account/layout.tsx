'use client'

import { usePathname } from 'next/navigation'
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
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Home,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const sidebarLinks = [
  {
    title: 'Dashboard',
    href: '/account',
    icon: LayoutDashboard,
  },
  {
    title: 'Orders',
    href: '/account/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Payments',
    href: '/account/payments',
    icon: CreditCard,
  },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r">
        {/* Sidebar Header */}
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
              D
            </div>
            <span className="font-semibold hidden md:inline group-data-[collapsible=icon]:hidden">
              Dropfor
            </span>
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          <SidebarMenu>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon

              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={link.title}
                  >
                    <Link href={link.href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Home">
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
