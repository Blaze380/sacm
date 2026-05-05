import { AuthConfigs } from 'arkos/auth';
import { authService } from "arkos/services";

export const consultationTypeAccessControl = {
  Create: {
    roles: [],
    name: "Create Consultation Type",
    description: "Permission to create new consultation type records",
  },
  Update: {
    roles: [],
    name: "Update Consultation Type",
    description: "Permission to update existing consultation type records",
  },
  Delete: {
    roles: [],
    name: "Delete Consultation Type",
    description: "Permission to delete consultation type records",
  },
  View: {
    roles: [],
    name: "View Consultation Type",
    description: "Permission to view consultation type records",
  },
} as const satisfies AuthConfigs["accessControl"];

function createConsultationTypePermission(action: string) {
  return authService.permission(action, "consultation-type", consultationTypeAccessControl);
}
export const consultationTypePermissions = {
  canCreate: createConsultationTypePermission("Create"),
  canUpdate: createConsultationTypePermission("Update"),
  canDelete: createConsultationTypePermission("Delete"),
  canView: createConsultationTypePermission("View"),
};

export const consultationTypeAuthenticationControl = {
  Create: true,
  Update: true,
  Delete: true,
  View: true,
};

const consultationTypeAuthConfigs: AuthConfigs = {
  authenticationControl: consultationTypeAuthenticationControl,
  accessControl: consultationTypeAccessControl,
};

export default consultationTypeAuthConfigs;
