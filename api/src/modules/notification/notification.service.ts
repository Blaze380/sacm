import { BaseService } from "arkos/services";
  
export class NotificationService extends BaseService<"notification"> {}

const notificationService = new NotificationService("notification");

export default notificationService;
