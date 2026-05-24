import { AdminAuthGuard } from '@/components/admin/admin-auth-guard'
import { AppSidebar } from '@/components/admin/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex min-h-svh flex-col">
        <AdminAuthGuard>{children}</AdminAuthGuard>
      </SidebarInset>
    </SidebarProvider>
  )
}
