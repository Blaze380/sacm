import { IsOptional, IsNotEmpty, IsString, IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TriageStatus } from "@prisma/client";

class UserForUpdateTriageDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class UpdateTriageDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  complaint?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  symptomDuration?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  symptomTaken?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  actionTaken?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  reactionAfterAction?: string;

  @IsOptional()
  @IsEnum(TriageStatus)
  status?: TriageStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForUpdateTriageDto)
  patient?: UserForUpdateTriageDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForUpdateTriageDto)
  analyzedBy?: UserForUpdateTriageDto;
}