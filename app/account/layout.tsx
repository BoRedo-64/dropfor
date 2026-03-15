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
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Home,
  Package,
} from 'lucide-react'

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

        {/* Header */}
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg">
              <Package className="h-5 w-5" />
            </div>

            <span className="text-xl font-semibold hidden md:inline group-data-[collapsible=icon]:hidden">
              Dropfor
            </span>
          </div>
        </SidebarHeader>

        {/* Menu */}
        <SidebarContent>
          <SidebarMenu>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon

              return (
                <SidebarMenuItem
                  key={link.href}
                  className="border-b border-muted/40"
                >
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={link.title}
                    className="py-6 text-lg"
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-5 px-5"
                    >
                      <Icon className="!h-6 !w-6" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {link.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Home"
                className="py-6 text-lg"
              >
                <Link
                  href="/"
                  className="flex items-center gap-5 px-5"
                >
                  <Home className="!h-6 !w-6" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Home
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

      </Sidebar>

      {/* Page Content */}
      <SidebarInset>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}