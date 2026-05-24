import { IsDate, ValidateNested, IsNotEmpty, IsString, IsOptional, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { AppointmentStatus, PriorityLevel, AppointmentSource } from "@prisma/client";

class UserForCreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class SpecialtyForCreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class ConsultationTypeForCreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class TriageForCreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class DoctorForCreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class CreateAppointmentDto {
  @IsDate()
  date!: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForCreateAppointmentDto)
  patient!: UserForCreateAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpecialtyForCreateAppointmentDto)
  specialty!: SpecialtyForCreateAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ConsultationTypeForCreateAppointmentDto)
  consultationType!: ConsultationTypeForCreateAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DoctorForCreateAppointmentDto)
  doctor?: DoctorForCreateAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TriageForCreateAppointmentDto)
  triage?: TriageForCreateAppointmentDto;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @IsOptional()
  @IsEnum(AppointmentSource)
  source?: AppointmentSource;
}