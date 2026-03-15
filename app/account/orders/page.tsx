import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-muted-foreground">View and manage your orders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Orders
            </CardTitle>
            <CardDescription>
              Track all your orders in one place
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No orders yet. Start by placing your first order.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
