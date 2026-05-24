import 'reflect-metadata'
import {
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsIn,
} from 'class-validator'
import { Province, UserRole } from '@prisma/client'

export default class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'email is required' })
  @IsOptional()
  email?: string

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @IsOptional()
  password?: string

  @IsBoolean()
  @IsOptional()
  isSuperUser?: boolean

  @IsBoolean()
  @IsOptional()
  isStaff?: boolean

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsEnum(UserRole)
  @IsIn([UserRole.RECEPCIONISTA], {
    message: 'Only RECEPCIONISTA users can be updated through this endpoint',
  })
  @IsOptional()
  role?: UserRole

  @IsString()
  @IsOptional()
  firstName?: string

  @IsString()
  @IsOptional()
  lastName?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsEnum(Province)
  @IsOptional()
  province?: Province

  @IsString()
  @IsOptional()
  city?: string

  @IsString()
  @IsOptional()
  neighborhood?: string
}
