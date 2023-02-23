import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  MinLength
} from 'class-validator'
import { Plato } from 'src/plato/entities/plato.entity'
import { Pedido } from '../entities/pedido.entity'

export class CreatePedidoPlatoDto {
  @IsNumber()
  @IsPositive()
  pedidoplato_cant: number

  @IsUUID()
  @MinLength(1)
  plato_id: Plato

  @IsUUID()
  @MinLength(1)
  @IsOptional()
  pedido_id: Pedido
}
