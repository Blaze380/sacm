import { IsOptional, IsString } from 'class-validator'

export default class RejectTriageDto {
  @IsOptional()
  @IsString()
  rejectionReason?: string
}
