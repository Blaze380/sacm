import { BaseService } from 'arkos/services'

export class DoctorService extends BaseService<'doctor'> {}

const doctorService = new DoctorService('doctor')

export default doctorService
