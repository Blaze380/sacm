import { AuthConfigs } from 'arkos/auth';
import { authService } from "arkos/services";

export const notificationAccessControl = {
  Create: {
    roles: [],
    name: "Create Notification",
    description: "Permission to create new notification records",
  },
  Update: {
    roles: [],
    name: "Update Notification",
    description: "Permission to update existing notification records",
  },
  Delete: {
    roles: [],
    name: "Delete Notification",
    description: "Permission to delete notification records",
  },
  View: {
    roles: [],
    name: "View Notification",
    description: "Permission to view notification records",
  },
} as const satisfies AuthConfigs["accessControl"];

function createNotificationPermission(action: string) {
  return authService.permission(action, "notification", notificationAccessControl);
}
export const notificationPermissions = {
  canCreate: createNotificationPermission("Create"),
  canUpdate: createNotificationPermission("Update"),
  canDelete: createNotificationPermission("Delete"),
  canView: createNotificationPermission("View"),
};

export const notificationAuthenticationControl = {
  Create: true,
  Update: true,
  Delete: true,
  View: true,
};

const notificationAuthConfigs: AuthConfigs = {
  authenticationControl: notificationAuthenticationControl,
  accessControl: notificationAccessControl,
};

export default notificationAuthConfigs;
