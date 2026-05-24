import 'reflect-metadata'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { DoctorAvailabilityDto } from './doctor-availability.dto'

export default class UpdateDoctorDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsUUID()
  @IsOptional()
  specialtyId?: string

  @ValidateNested()
  @Type(() => DoctorAvailabilityDto)
  @IsOptional()
  availability?: DoctorAvailabilityDto
}
