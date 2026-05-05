import { IsOptional, IsString, IsNumber, ValidateNested, Max, IsNotEmpty, IsBoolean } from "class-validator";
import { Type, Transform } from "class-transformer";

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

class UserForQueryNotificationDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class NotificationQueryDto {
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
  @Type(() => UserForQueryNotificationDto)
  user?: UserForQueryNotificationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  title?: StringFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  message?: StringFilter;

  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  createdAt?: DateTimeFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  updatedAt?: DateTimeFilter;
}