import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDate } from "class-validator";
import { TriageStatus } from "@prisma/client";

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
  symptomTaken!: string;

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

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}