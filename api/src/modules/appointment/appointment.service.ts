import { BaseService } from "arkos/services";
  
export class AppointmentService extends BaseService<"appointment"> {}

const appointmentService = new AppointmentService("appointment");

export default appointmentService;
