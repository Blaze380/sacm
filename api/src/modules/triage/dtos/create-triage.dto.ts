import { IsNotEmpty, IsString, IsOptional, IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TriageStatus } from "@prisma/client";

class UserForCreateTriageDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class CreateTriageDto {
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
  status?: TriageStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForCreateTriageDto)
  patient!: UserForCreateTriageDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForCreateTriageDto)
  analyzedBy?: UserForCreateTriageDto;
}