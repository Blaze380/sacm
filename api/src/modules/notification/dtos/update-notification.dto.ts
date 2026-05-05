import { IsOptional, ValidateNested, IsNotEmpty, IsString, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

class UserForUpdateNotificationDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class UpdateNotificationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserForUpdateNotificationDto)
  user?: UserForUpdateNotificationDto;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}