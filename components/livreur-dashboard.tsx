'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Package, Phone, MapPin, Calendar } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  clientName: string
  phone: string
  city: string
  status: 'pending' | 'shipped' | 'delivered' | 'returned'
  date: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#ORD-2025-001',
    clientName: 'Jean Dupont',
    phone: '+33 6 12 34 56 78',
    city: 'Paris',
    status: 'pending',
    date: '2025-03-20',
  },
  {
    id: '2',
    orderNumber: '#ORD-2025-002',
    clientName: 'Marie Martin',
    phone: '+33 6 98 76 54 32',
    city: 'Lyon',
    status: 'shipped',
    date: '2025-03-19',
  },
  {
    id: '3',
    orderNumber: '#ORD-2025-003',
    clientName: 'Pierre Bernard',
    phone: '+33 6 45 67 89 01',
    city: 'Marseille',
    status: 'delivered',
    date: '2025-03-18',
  },
  {
    id: '4',
    orderNumber: '#ORD-2025-004',
    clientName: 'Sophie Laurent',
    phone: '+33 6 23 45 67 89',
    city: 'Toulouse',
    status: 'pending',
    date: '2025-03-20',
  },
  {
    id: '5',
    orderNumber: '#ORD-2025-005',
    clientName: 'Thomas Moreau',
    phone: '+33 6 56 78 90 12',
    city: 'Nice',
    status: 'returned',
    date: '2025-03-17',
  },
]

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  shipped: { label: 'Shipped', className: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
  returned: { label: 'Returned', className: 'bg-red-100 text-red-800' },
}

export function LivreurDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [orderNumber, setOrderNumber] = useState('')
  const [status, setStatus] = useState<'pending' | 'shipped' | 'delivered' | 'returned'>('pending')

  const handleUpdateStatus = () => {
    if (!orderNumber.trim()) return

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderNumber === orderNumber ? { ...order, status } : order
      )
    )

    setOrderNumber('')
    setStatus('pending')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full-width padding for mobile, responsive padding for larger screens */}
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Livreur Dashboard</h1>
          <p className="text-base sm:text-lg text-muted-foreground">Manage your assigned orders</p>
        </div>

        {/* Quick Status Update Card - Priority Section */}
        <Card className="mb-8 border-2 border-accent shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl text-accent">Quick Status Update</CardTitle>
            <CardDescription>Update your order status in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Order Number Input */}
              <div className="space-y-2">
                <Label htmlFor="order-number" className="text-base font-medium">
                  Order Number
                </Label>
                <Input
                  id="order-number"
                  placeholder="Enter order number (#ORD-2025-001)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="text-base h-12 placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <Label htmlFor="status-select" className="text-base font-medium">
                  New Status
                </Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger id="status-select" className="text-base h-12">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Update Button */}
              <Button
                onClick={handleUpdateStatus}
                className="w-full bg-accent hover:bg-accent/90 text-white text-base h-12 font-semibold rounded-lg transition-colors"
              >
                Update Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table - Responsive Cards on Mobile */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Assigned Orders</h2>
          </div>

          {/* Mobile: Stacked Cards */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {orders.map((order) => (
              <Card key={order.id} className="border border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold text-foreground">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">{order.clientName}</p>
                      </div>
                      <Badge className={`${statusConfig[order.status].className} text-xs font-medium px-3 py-1`}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">{order.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">{new Date(order.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop: Table View */}
          <div className="hidden lg:block">
            <Card className="border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order Number</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Client Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">City</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{order.orderNumber}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{order.clientName}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{order.phone}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{order.city}</td>
                        <td className="px-6 py-4">
                          <Badge className={`${statusConfig[order.status].className} text-xs font-medium`}>
                            {statusConfig[order.status].label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
