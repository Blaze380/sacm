import { BaseService } from "arkos/services";
  
export class ConsultationTypeService extends BaseService<"consultation-type"> {}

const consultationTypeService = new ConsultationTypeService("consultation-type");

export default consultationTypeService;
