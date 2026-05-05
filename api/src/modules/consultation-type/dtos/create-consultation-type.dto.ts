import { IsNotEmpty, IsString } from "class-validator";

export default class CreateConsultationTypeDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}