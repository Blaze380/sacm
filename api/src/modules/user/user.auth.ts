import { UserRole } from '@prisma/client'
import { AuthConfigs } from 'arkos/auth'
import { authService } from 'arkos/services'

export const userAccessControl = {
  Create: {
    roles: [UserRole.ADMINISTRADOR],
    name: 'Create User',
    description: 'Permission to create new user records',
  },
  Update: {
    roles: [UserRole.ADMINISTRADOR],
    name: 'Update User',
    description: 'Permission to update existing user records',
  },
  Delete: {
    roles: [UserRole.ADMINISTRADOR],
    name: 'Delete User',
    description: 'Permission to delete user records',
  },
  View: {
    roles: [UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: 'View User',
    description: 'Permission to view user records',
  },
} as const satisfies AuthConfigs['accessControl']

function createUserPermission(action: string) {
  return authService.permission(action, 'user', userAccessControl)
}

export const userPermissions = {
  canCreate: createUserPermission('Create'),
  canUpdate: createUserPermission('Update'),
  canDelete: createUserPermission('Delete'),
  canView: createUserPermission('View'),
}

export const userAuthenticationControl = {
  Create: true,
  Update: true,
  Delete: true,
  View: true,
}

const userAuthConfigs: AuthConfigs = {
  authenticationControl: userAuthenticationControl,
  accessControl: userAccessControl,
}

export default userAuthConfigs
