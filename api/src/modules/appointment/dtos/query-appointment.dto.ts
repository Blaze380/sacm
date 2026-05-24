import { IsOptional, IsString, IsNumber, ValidateNested, Max, IsNotEmpty, IsEnum } from "class-validator";
import { Type, Transform } from "class-transformer";
import { AppointmentStatus, PriorityLevel, AppointmentSource } from "@prisma/client";

class StringFilter {
  @IsOptional()
  @IsString()
  @Type(() => String)
  icontains?: string;
}

class DateTimeFilter {
  @IsOptional()
  @IsString()
  @Type(() => String)
  equals?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  gte?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  lte?: string;
}

class UserForQueryAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class SpecialtyForQueryAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class ConsultationTypeForQueryAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class TriageForQueryAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

class DoctorForQueryAppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class AppointmentQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  page?: number;

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : undefined))
  limit?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  sort?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  fields?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  date?: DateTimeFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForQueryAppointmentDto)
  patient?: UserForQueryAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SpecialtyForQueryAppointmentDto)
  specialty?: SpecialtyForQueryAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ConsultationTypeForQueryAppointmentDto)
  consultationType?: ConsultationTypeForQueryAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DoctorForQueryAppointmentDto)
  doctor?: DoctorForQueryAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TriageForQueryAppointmentDto)
  triage?: TriageForQueryAppointmentDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  notes?: StringFilter;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @IsOptional()
  @IsEnum(AppointmentSource)
  source?: AppointmentSource;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  createdAt?: DateTimeFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  updatedAt?: DateTimeFilter;
}