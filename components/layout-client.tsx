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

  return (
    <>
      {!isAccountPage && <Navbar />}

      <main className="flex-1">{children}</main>

      {!isAccountPage && <Footer />}
    </>
  )
}