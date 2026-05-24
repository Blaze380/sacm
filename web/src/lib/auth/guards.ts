export type AuthUser = {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
}

export const ROLES = {
  ADMIN: 'ADMINISTRADOR',
  RECEPTIONIST: 'RECEPCIONISTA',
  PATIENT: 'UTILIZADOR',
} as const

export function isAdmin({data}: {data: AuthUser}): boolean {
  return data.role === ROLES.ADMIN
}

export function isReceptionist({data}: {data: AuthUser}): boolean {
  return data.role === ROLES.RECEPTIONIST
}

export function canAccessStaffPanel(user: AuthUser): boolean {
  return isAdmin(user) || isReceptionist(user)
}

export function getDefaultStaffRoute(role: string): string {
  if (role === ROLES.RECEPTIONIST) return '/admin/triagens'
  return '/admin/especialidades'
}

const ADMIN_ONLY_PREFIXES = [
  '/admin/especialidades',
  '/admin/tipos-consulta',
  '/admin/medicos',
  '/admin/utilizadores',
]

export function isAdminOnlyPath(pathname: string): boolean {
  return ADMIN_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function canAccessPath(user: AuthUser, pathname: string): boolean {
  if (!canAccessStaffPanel(user)) return false
  if (isAdmin(user)) return true
  return !isAdminOnlyPath(pathname)
}
