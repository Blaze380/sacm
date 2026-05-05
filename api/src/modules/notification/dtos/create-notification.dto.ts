import { ValidateNested, IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

class UserForCreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  id!: string;
}

export default class CreateNotificationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UserForCreateNotificationDto)
  user!: UserForCreateNotificationDto;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}