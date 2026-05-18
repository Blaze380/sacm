import { UserRole } from '@prisma/client';
import { AuthConfigs } from 'arkos/auth';
import { authService } from "arkos/services";

export const triageAccessControl = {
  Create: {
    roles: [UserRole.UTILIZADOR],
    name: "Create Triage",
    description: "Permission to create new triage records",
  },
  Update: {
    roles: [UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA, UserRole.UTILIZADOR],
    name: "Update Triage",
    description: "Permission to update existing triage records",
  },
  Delete: {
    roles: [UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA, UserRole.UTILIZADOR],
    name: "Delete Triage",
    description: "Permission to delete triage records",
  },
  View: {
    roles: [UserRole.UTILIZADOR, UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: "View Triage",
    description: "Permission to view triage records",
  },
} as const satisfies AuthConfigs["accessControl"];

function createTriagePermission(action: string) {
  return authService.permission(action, "triage", triageAccessControl);
}
export const triagePermissions = {
  canCreate: createTriagePermission("Create"),
  canUpdate: createTriagePermission("Update"),
  canDelete: createTriagePermission("Delete"),
  canView: createTriagePermission("View"),
};

export const triageAuthenticationControl = {
  Create: true,
  Update: true,
  Delete: true,
  View: true,
};

const triageAuthConfigs: AuthConfigs = {
  authenticationControl: triageAuthenticationControl,
  accessControl: triageAccessControl,
};

export default triageAuthConfigs;
