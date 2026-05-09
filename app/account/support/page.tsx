import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  Phone,
  Headphones,
  Menu,
} from "lucide-react"

import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function SupportPage() {
  const contacts = [
    {
      label: "Support Principal",
      number: "+216 12 345 678",
    },
    {
      label: "Service Livraison",
      number: "+216 98 765 432",
    },
    {
      label: "Urgence Pickup",
      number: "+216 55 111 222",
    },
  ]

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
              Support
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              Contactez notre équipe
            </p>
          </div>

        </div>

        {/* Desktop Header */}
        <div className="mb-8 hidden md:block">

          <h1 className="text-3xl font-bold mb-2">
            Service Client
          </h1>

          <p className="text-muted-foreground">
            Contactez notre équipe de support
          </p>

        </div>

        {/* Contacts */}
        <div className="grid gap-4">

          {contacts.map((contact) => (
            <Card key={contact.number}>

              <CardContent className="p-5 flex items-center justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">

                    <Headphones className="h-6 w-6 text-primary" />

                  </div>

                  <div>

                    <p className="font-semibold">
                      {contact.label}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {contact.number}
                    </p>

                  </div>

                </div>

                <a
                  href={`tel:${contact.number}`}
                  className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-muted transition"
                >

                  <Phone className="h-5 w-5" />

                </a>

              </CardContent>

            </Card>
          ))}

        </div>

      </div>
    </div>
  )
}