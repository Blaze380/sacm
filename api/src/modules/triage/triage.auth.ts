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
    roles: [UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: "Update Triage",
    description: "Permission to update existing triage records",
  },
  Delete: {
    roles: [UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: "Delete Triage",
    description: "Permission to delete triage records",
  },
  View: {
    roles: [UserRole.UTILIZADOR, UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: "View Triage",
    description: "Permission to view triage records",
  },
  Approve: {
    roles: [UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: "Approve Triage",
    description: "Permission to approve and refer triage records",
  },
  Reject: {
    roles: [UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA],
    name: "Reject Triage",
    description: "Permission to reject triage records",
  },
  StartReview: {
    roles: [UserRole.ADMINISTRADOR, UserRole.RECEPCIONISTA,UserRole.UTILIZADOR],
    name: "Start Triage Review",
    description: "Permission to mark a triage as under review",
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
  canApprove: createTriagePermission("Approve"),
  canReject: createTriagePermission("Reject"),
  canStartReview: createTriagePermission("StartReview"),
};

export const triageAuthenticationControl = {
  Create: true,
  Update: true,
  Delete: true,
  View: true,
  Approve: true,
  Reject: true,
  StartReview: true,
};

const triageAuthConfigs: AuthConfigs = {
  authenticationControl: triageAuthenticationControl,
  accessControl: triageAccessControl,
};

export default triageAuthConfigs;
