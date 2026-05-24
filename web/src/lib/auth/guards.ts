export type AuthUser = {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
}

export function isAdmin(user: AuthUser): boolean {
  return user.role === 'ADMINISTRADOR'
}
