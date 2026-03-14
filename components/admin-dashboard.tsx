'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, CheckCircle2, Save } from 'lucide-react'

interface User {
  id: string
  first_name: string | null
  last_name: string | null
}

interface UserStats {
  id: string
  user_id: string
  products: number
  revenue: number
  balance: number
  total: number
  delivered: number
  returns: number
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    products: 0,
    revenue: 0,
    balance: 0,
    total: 0,
    delivered: 0,
    returns: 0,
  })

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Failed to fetch users',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Fetch stats when user is selected
  useEffect(() => {
    if (!selectedUserId) {
      setStats(null)
      setFormData({
        products: 0,
        revenue: 0,
        balance: 0,
        total: 0,
        delivered: 0,
        returns: 0,
      })
      return
    }

    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/user-stats?userId=${selectedUserId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user stats')
        }
        const data = await response.json()
        if (data) {
          setStats(data)
          setFormData({
            products: data.products,
            revenue: data.revenue,
            balance: data.balance,
            total: data.total,
            delivered: data.delivered,
            returns: data.returns,
          })
        } else {
          // No stats found, initialize with defaults
          setStats(null)
          setFormData({
            products: 0,
            revenue: 0,
            balance: 0,
            total: 0,
            delivered: 0,
            returns: 0,
          })
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Failed to fetch stats',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [selectedUserId])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const numValue = field === 'revenue' || field === 'balance' ? parseFloat(value) || 0 : parseInt(value) || 0
    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  const handleSave = async () => {
    if (!selectedUserId) {
      setMessage({ type: 'error', text: 'Please select a user first' })
      return
    }

    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch('/api/admin/user-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUserId,
          ...formData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save user stats')
      }

      const data = await response.json()
      setStats(data)
      setMessage({ type: 'success', text: 'User stats updated successfully!' })

      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save stats',
      })
    } finally {
      setSaving(false)
    }
  }

  const selectedUserName =
    users.find((u) => u.id === selectedUserId)?.first_name &&
    users.find((u) => u.id === selectedUserId)?.last_name
      ? `${users.find((u) => u.id === selectedUserId)?.first_name} ${users.find((u) => u.id === selectedUserId)?.last_name}`
      : 'Select a user'

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage user statistics and account data</p>
        </div>

        {/* Messages */}
        {message && (
          <Card className={`mb-6 border-2 ${message.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}`}>
            <CardContent className="p-4 flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <span className={message.type === 'success' ? 'text-green-900 dark:text-green-200' : 'text-red-900 dark:text-red-200'}>
                {message.text}
              </span>
            </CardContent>
          </Card>
        )}

        {/* User Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select User</CardTitle>
            <CardDescription>Choose a user to view and edit their statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Stats Editor */}
        {selectedUserId && (
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Edit stats for {selectedUserName}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Products and Total */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Products
                      </label>
                      <Input
                        type="number"
                        value={formData.products}
                        onChange={(e) => handleInputChange('products', e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Total Orders
                      </label>
                      <Input
                        type="number"
                        value={formData.total}
                        onChange={(e) => handleInputChange('total', e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Revenue and Balance */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Revenue ($)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.revenue}
                        onChange={(e) => handleInputChange('revenue', e.target.value)}
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Balance ($)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.balance}
                        onChange={(e) => handleInputChange('balance', e.target.value)}
                        placeholder="0.00"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Delivered and Returns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Delivered
                      </label>
                      <Input
                        type="number"
                        value={formData.delivered}
                        onChange={(e) => handleInputChange('delivered', e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Returns
                      </label>
                      <Input
                        type="number"
                        value={formData.returns}
                        onChange={(e) => handleInputChange('returns', e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full"
                    size="lg"
                  >
                    {saving ? (
                      <>
                        <Spinner className="h-4 w-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
