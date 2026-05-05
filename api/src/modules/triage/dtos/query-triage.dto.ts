import { IsOptional, IsString, IsNumber, ValidateNested, Max, IsNotEmpty, IsEnum } from "class-validator";
import { Type, Transform } from "class-transformer";
import { TriageStatus } from "@prisma/client";

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

class UserForQueryTriageDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class TriageQueryDto {
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
  @Type(() => StringFilter)
  complaint?: StringFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  symptomDuration?: StringFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  symptomTaken?: StringFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  actionTaken?: StringFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  reactionAfterAction?: StringFilter;

  @IsOptional()
  @IsEnum(TriageStatus)
  status?: TriageStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForQueryTriageDto)
  patient?: UserForQueryTriageDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserForQueryTriageDto)
  analyzedBy?: UserForQueryTriageDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  createdAt?: DateTimeFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  updatedAt?: DateTimeFilter;
}