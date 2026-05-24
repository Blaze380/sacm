import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { PriorityLevel } from '@prisma/client'

export default class ApproveTriageDto {
  @IsNotEmpty()
  @IsString()
  specialtyId!: string

  @IsNotEmpty()
  @IsString()
  consultationTypeId!: string

  @IsEnum(PriorityLevel)
  priority!: PriorityLevel
}
