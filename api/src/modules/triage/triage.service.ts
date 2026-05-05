import { BaseService } from "arkos/services";
  
export class TriageService extends BaseService<"triage"> {}

const triageService = new TriageService("triage");

export default triageService;
