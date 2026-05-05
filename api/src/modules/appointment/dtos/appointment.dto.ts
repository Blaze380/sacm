import { IsNotEmpty, IsString, IsDate, IsOptional, IsEnum } from "class-validator";
import { AppointmentStatus, PriorityLevel, AppointmentSource } from "@prisma/client";

export default class AppointmentDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsDate()
  date!: Date;

  @IsNotEmpty()
  @IsString()
  patientId!: string;

  @IsNotEmpty()
  @IsString()
  specialtyId!: string;

  @IsNotEmpty()
  @IsString()
  consultationTypeId!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  doctorId?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  triageId?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority!: PriorityLevel;

  @IsOptional()
  @IsEnum(AppointmentSource)
  source!: AppointmentSource;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}