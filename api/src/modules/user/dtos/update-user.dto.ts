import 'reflect-metadata'
import { 
  IsString, 
  MinLength, 
  Matches, 
  IsNotEmpty, 
  IsBoolean, 
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum
} from 'class-validator'
import { Type } from 'class-transformer'
import apiActions from "../../../utils/validation/api-actions"
import { UserRole } from "@prisma/client"


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
  @IsOptional()
  role?: UserRole
}
