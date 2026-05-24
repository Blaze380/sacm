import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export default class DoctorDto {
  @IsNotEmpty()
  @IsString()
  id!: string

  @IsNotEmpty()
  @IsString()
  firstName!: string

  @IsNotEmpty()
  @IsString()
  lastName!: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  email?: string

  @IsNotEmpty()
  @IsString()
  specialtyId!: string

  @IsDate()
  createdAt!: Date

  @IsDate()
  updatedAt!: Date
}
