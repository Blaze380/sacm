import { IsOptional, IsNotEmpty, IsString } from "class-validator";

export default class UpdateSpecialtyDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
}