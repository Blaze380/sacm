import { IsNotEmpty, IsString } from "class-validator";

export default class CreateSpecialtyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}