import { IsOptional, IsDate, ValidateNested, IsNotEmpty, IsString, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { AppointmentStatus, PriorityLevel, AppointmentSource } from "@prisma/client";

class UserForUpdateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class SpecialtyForUpdateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class ConsultationTypeForUpdateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class TriageForUpdateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class UpdateAppointmentDto {
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForUpdateAppointmentDto)
  patient?: UserForUpdateAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpecialtyForUpdateAppointmentDto)
  specialty?: SpecialtyForUpdateAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ConsultationTypeForUpdateAppointmentDto)
  consultationType?: ConsultationTypeForUpdateAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForUpdateAppointmentDto)
  doctor?: UserForUpdateAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TriageForUpdateAppointmentDto)
  triage?: TriageForUpdateAppointmentDto;

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