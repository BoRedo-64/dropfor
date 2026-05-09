import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  Clock3,
  Headphones,
  Menu,
} from "lucide-react"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ConfirmationPage() {
  return (
    <div className="py-6 md:py-12">
      <div className="container mx-auto px-4">

        {/* Mobile Header */}
        <div className="flex items-center gap-3 mb-6 md:hidden">

          <SidebarTrigger className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>

          <div>
            <h1 className="text-2xl font-bold leading-none">
              Fulfillment
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Service bientôt disponible
            </p>
          </div>

        </div>

        {/* Desktop Header */}
        <div className="mb-8 hidden md:block">

          <h1 className="text-3xl font-bold mb-2">
            Fulfillment
          </h1>

          <p className="text-muted-foreground">
            Service bientôt disponible
          </p>

        </div>

        <Card>

          <CardContent className="py-20 flex flex-col items-center text-center">

            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">

              <Clock3 className="h-10 w-10 text-primary" />

            </div>

            <h2 className="text-2xl font-bold mb-3">
              Coming Soon
            </h2>

            <p className="text-muted-foreground max-w-md mb-8">
              Le service de fulfillment sera bientôt disponible.
              Contactez le support pour plus d’informations.
            </p>

            <Link href="/account/support">

              <Button className="flex items-center gap-2">

                <Headphones className="h-4 w-4" />

                Contacter le support

              </Button>

            </Link>

          </CardContent>

        </Card>

      </div>
    </div>
  )
}