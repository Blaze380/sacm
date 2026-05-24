'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  LogOut,
  Stethoscope,
  Tags,
  Users,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getMe } from '@/gen/clients/getMe'
import { apiClient } from '@/lib/api/client'
import { isAdmin, type AuthUser } from '@/lib/auth/guards'
import { clearAccessToken } from '@/lib/auth/session'

const gestaoItems = [
  { href: '/admin/especialidades', label: 'Especialidades', icon: Stethoscope },
  { href: '/admin/tipos-consulta', label: 'Tipos de consulta', icon: Tags },
  { href: '/admin/medicos', label: 'Médicos', icon: CalendarDays },
]

const operacaoItems = [
  { href: '/admin/triagens', label: 'Triagens', icon: ClipboardList },
  { href: '/admin/utilizadores', label: 'Utilizadores', icon: Users, adminOnly: true },
  { href: '/admin/consultas', label: 'Consultas', icon: CalendarCheck, adminOnly: true },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    getMe({ client: apiClient })
      .then((me) => setUser(me as AuthUser))
      .catch(() => setUser(null))
  }, [])

  const showGestao = user ? isAdmin(user) : false

  async function handleLogout() {
    await clearAccessToken()
    window.location.href = '/admin/login'
  }

  const visibleOperacao = operacaoItems.filter(
    (item) => !item.adminOnly || (user && isAdmin(user))
  )

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">SACM</span>
          <span className="text-xs text-muted-foreground">
            {user?.role === 'RECEPCIONISTA' ? 'Recepção' : 'Administração'}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {showGestao ? (
          <SidebarGroup>
            <SidebarGroupLabel>Gestão</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {gestaoItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
        <SidebarGroup>
          <SidebarGroupLabel>Operação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleOperacao.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
