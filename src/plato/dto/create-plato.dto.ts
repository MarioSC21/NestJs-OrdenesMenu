import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength
} from 'class-validator'
import { Categoria } from 'src/categoria/entities/categoria.entity'

export class CreatePlatoDto {
  @IsString()
  @MinLength(1)
  plato_nom: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  plato_pre?: number

  @IsString()
  @IsOptional()
  categoria_id: Categoria
}
