import { AdminDashboard } from '@/components/admin-dashboard'

export const metadata = {
  title: 'Admin Dashboard | DropShip Pro',
  description: 'Manage users and their statistics',
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard />
    </div>
  )
}
