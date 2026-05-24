import 'reflect-metadata'
import { IsBoolean, IsString, Matches, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class DayAvailabilityDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'start must be HH:mm format' })
  start!: string

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'end must be HH:mm format' })
  end!: string

  @IsBoolean()
  isAvailable!: boolean
}

export class DoctorAvailabilityDto {
  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  monday!: DayAvailabilityDto

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  tuesday!: DayAvailabilityDto

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  wednesday!: DayAvailabilityDto

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  thursday!: DayAvailabilityDto

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  friday!: DayAvailabilityDto

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  saturday!: DayAvailabilityDto

  @ValidateNested()
  @Type(() => DayAvailabilityDto)
  sunday!: DayAvailabilityDto
}
