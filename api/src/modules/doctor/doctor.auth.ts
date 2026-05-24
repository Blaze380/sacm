import { UserRole } from '@prisma/client'
import { AuthConfigs } from 'arkos/auth'
import { authService } from 'arkos/services'

export const doctorAccessControl = {
  Create: {
    roles: [UserRole.ADMINISTRADOR],
    name: 'Create Doctor',
    description: 'Permission to create new doctor records',
  },
  Update: {
    roles: [UserRole.ADMINISTRADOR],
    name: 'Update Doctor',
    description: 'Permission to update existing doctor records',
  },
  Delete: {
    roles: [UserRole.ADMINISTRADOR],
    name: 'Delete Doctor',
    description: 'Permission to delete doctor records',
  },
  View: {
    roles: [UserRole.UTILIZADOR, UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: 'View Doctor',
    description: 'Permission to view doctor records',
  },
} as const satisfies AuthConfigs['accessControl']

function createDoctorPermission(action: string) {
  return authService.permission(action, 'doctor', doctorAccessControl)
}

export const doctorPermissions = {
  canCreate: createDoctorPermission('Create'),
  canUpdate: createDoctorPermission('Update'),
  canDelete: createDoctorPermission('Delete'),
  canView: createDoctorPermission('View'),
}

export const doctorAuthenticationControl = {
  Create: true,
  Update: true,
  Delete: true,
  View: true,
}

const doctorAuthConfigs: AuthConfigs = {
  authenticationControl: doctorAuthenticationControl,
  accessControl: doctorAccessControl,
}

export default doctorAuthConfigs
