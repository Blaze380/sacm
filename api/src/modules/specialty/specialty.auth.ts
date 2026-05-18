import { UserRole } from '@prisma/client';
import { AuthConfigs } from 'arkos/auth';
import { authService } from "arkos/services";

export const specialtyAccessControl = {
  Create: {
    roles: [UserRole.ADMINISTRADOR],
    name: "Create Specialty",
    description: "Permission to create new specialty records",
  },
  Update: {
    roles: [UserRole.ADMINISTRADOR],
    name: "Update Specialty",
    description: "Permission to update existing specialty records",
  },
  Delete: {
    roles: [UserRole.ADMINISTRADOR],
    name: "Delete Specialty",
    description: "Permission to delete specialty records",
  },
  View: {
    roles: [UserRole.UTILIZADOR, UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: "View Specialty",
    description: "Permission to view specialty records",
  },
} as const satisfies AuthConfigs["accessControl"];

function createSpecialtyPermission(action: string) {
  return authService.permission(action, "specialty", specialtyAccessControl);
}
export const specialtyPermissions = {
  canCreate: createSpecialtyPermission("Create"),
  canUpdate: createSpecialtyPermission("Update"),
  canDelete: createSpecialtyPermission("Delete"),
  canView: createSpecialtyPermission("View"),
};

export const specialtyAuthenticationControl = {
  Create: true,
  Update: true,
  Delete: true,
  View: true,
};

const specialtyAuthConfigs: AuthConfigs = {
  authenticationControl: specialtyAuthenticationControl,
  accessControl: specialtyAccessControl,
};

export default specialtyAuthConfigs;
