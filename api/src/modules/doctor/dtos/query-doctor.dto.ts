import {
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  Max,
  IsNotEmpty,
} from 'class-validator'
import { Type, Transform } from 'class-transformer'

class StringFilter {
  @IsOptional()
  @IsString()
  @Type(() => String)
  icontains?: string
}

class DateTimeFilter {
  @IsOptional()
  @IsString()
  @Type(() => String)
  equals?: string

  @IsOptional()
  @IsString()
  @Type(() => String)
  gte?: string

  @IsOptional()
  @IsString()
  @Type(() => String)
  lte?: string
}

class SpecialtyFilter {
  @IsOptional()
  @IsString()
  @Type(() => String)
  id?: string
}

export default class DoctorQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  page?: number

  @IsOptional()
  @IsNumber()
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : undefined))
  limit?: number

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  sort?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  fields?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  firstName?: StringFilter

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  lastName?: StringFilter

  @IsOptional()
  @ValidateNested()
  @Type(() => StringFilter)
  email?: StringFilter

  @IsOptional()
  @ValidateNested()
  @Type(() => SpecialtyFilter)
  specialty?: SpecialtyFilter

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  createdAt?: DateTimeFilter

  @IsOptional()
  @ValidateNested()
  @Type(() => DateTimeFilter)
  updatedAt?: DateTimeFilter
}
