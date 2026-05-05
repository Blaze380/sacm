import { IsOptional, IsNotEmpty, IsString } from "class-validator";

export default class UpdateConsultationTypeDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
}