import { PartialType } from '@nestjs/mapped-types'
import { CreateAuthDto } from './create-auth.dto'
import {
  ArrayMinSize,
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsOptional
} from 'class-validator'
import { validRoles } from '../interfaces'

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsBoolean()
  @IsOptional()
  is_active?: boolean

  @ArrayMinSize(1)
  @ArrayUnique()
  @IsOptional()
  @IsEnum(validRoles, { each: true })
  roles?: string[]
}
