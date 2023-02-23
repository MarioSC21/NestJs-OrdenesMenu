import { Type } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested
} from 'class-validator'
import { Auth } from 'src/auth/entities/auth.entity'
import { Mesa } from 'src/mesa/entities/mesa.entity'
import { CreatePedidoPlatoDto } from './create-pedidoPlato.dto'

export class CreatePedidoDto {
  @IsDateString()
  @IsOptional()
  pedido_fech?: Date

  @IsOptional()
  @IsString()
  @MinLength(1)
  pedido_nro?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  pedido_est?: string

  @IsString()
  @MinLength(1)
  @IsUUID()
  mesa_id: Mesa

  @IsNumber()
  @IsPositive()
  usu_id: Auth

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoPlatoDto)
  pedidoplatos: CreatePedidoPlatoDto[]
}
