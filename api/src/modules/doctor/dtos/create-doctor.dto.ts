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

export default class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string

  @IsString()
  @IsNotEmpty()
  lastName!: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsEmail()
  @IsOptional()
  email?: string

  @IsUUID()
  specialtyId!: string

  @ValidateNested()
  @Type(() => DoctorAvailabilityDto)
  @IsOptional()
  availability?: DoctorAvailabilityDto
}
