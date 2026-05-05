import { BaseService } from "arkos/services";
  
export class SpecialtyService extends BaseService<"specialty"> {}

const specialtyService = new SpecialtyService("specialty");

export default specialtyService;
