import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDate } from "class-validator";
import { TriageStatus, PriorityLevel } from "@prisma/client";

export default class TriageDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  complaint!: string;

  @IsNotEmpty()
  @IsString()
  symptomDuration!: string;

  @IsNotEmpty()
  @IsString()
  symptom!: string;

  @IsNotEmpty()
  @IsString()
  actionTaken!: string;

  @IsNotEmpty()
  @IsString()
  reactionAfterAction!: string;

  @IsOptional()
  @IsEnum(TriageStatus)
  status!: TriageStatus;

  @IsNotEmpty()
  @IsString()
  patientId!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  analyzedById?: string;

  @IsOptional()
  @IsString()
  specialtyId?: string;

  @IsOptional()
  @IsString()
  consultationTypeId?: string;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priority?: PriorityLevel;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}