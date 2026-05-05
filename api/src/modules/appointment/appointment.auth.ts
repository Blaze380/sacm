import { AuthConfigs } from 'arkos/auth';
import { authService } from "arkos/services";

export const appointmentAccessControl = {
  Create: {
    roles: [],
    name: "Create Appointment",
    description: "Permission to create new appointment records",
  },
  Update: {
    roles: [],
    name: "Update Appointment",
    description: "Permission to update existing appointment records",
  },
  Delete: {
    roles: [],
    name: "Delete Appointment",
    description: "Permission to delete appointment records",
  },
  View: {
    roles: [],
    name: "View Appointment",
    description: "Permission to view appointment records",
  },
} as const satisfies AuthConfigs["accessControl"];

function createAppointmentPermission(action: string) {
  return authService.permission(action, "appointment", appointmentAccessControl);
}
export const appointmentPermissions = {
  canCreate: createAppointmentPermission("Create"),
  canUpdate: createAppointmentPermission("Update"),
  canDelete: createAppointmentPermission("Delete"),
  canView: createAppointmentPermission("View"),
};

export const appointmentAuthenticationControl = {
  Create: true,
  Update: true,
  Delete: true,
  View: true,
};

const appointmentAuthConfigs: AuthConfigs = {
  authenticationControl: appointmentAuthenticationControl,
  accessControl: appointmentAccessControl,
};

export default appointmentAuthConfigs;
