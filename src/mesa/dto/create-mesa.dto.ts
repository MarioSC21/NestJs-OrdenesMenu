import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator'

export class CreateMesaDto {
  @IsString()
  @MaxLength(1)
  @MinLength(1)
  mesa_nro: string

  @IsInt()
  @IsPositive()
  @IsOptional()
  mesa_cap?: number
}
