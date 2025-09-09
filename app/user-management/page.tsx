import { DashboardLayout } from "@/components/sidebar-navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { UserManagement } from "@/components/user-management"

export default function UserManagementPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <UserManagement />
      </DashboardLayout>
    </ProtectedRoute>
  )
}




