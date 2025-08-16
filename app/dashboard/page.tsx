import { DashboardLayout } from "@/components/sidebar-navigation"
import { DashboardContent } from "@/components/dashboard-content"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  )
}


