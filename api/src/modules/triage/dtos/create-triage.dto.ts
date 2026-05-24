import { IsNotEmpty, IsString, IsOptional, IsEnum, ValidateNested } from "class-validator";
import { Type, Transform } from "class-transformer";
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

  /** Aceita `symptom` ou alias legado `symptomTaken` no JSON (não é coluna Prisma). */
  @Transform(({ obj }) => obj.symptom ?? obj.symptomTaken)
  @IsNotEmpty()
  @IsString()
  symptom!: string;

  @IsOptional()
  @IsString()
  actionTaken?: string;


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