import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard } from 'lucide-react'

export default function PaymentsPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payments</h1>
          <p className="text-muted-foreground">View and manage your payment methods</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Add and manage your payment methods
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No payment methods added yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
