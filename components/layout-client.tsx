"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAccountPage = pathname.startsWith("/account")
  const isDeliveryPage = pathname.startsWith("/livreur")
  const isAdminPage = pathname.startsWith("/admin")

  return (
    <>
      {!isAccountPage && !isAdminPage && !isDeliveryPage && <Navbar />}

      <main className="flex-1">{children}</main>

      {!isAccountPage && <Footer />}
    </>
  )
}