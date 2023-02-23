import { PartialType } from '@nestjs/mapped-types'
import { CreatePedidoPlatoDto } from './create-pedidoPlato.dto'

export class UpdatePedidoPlatoDto extends PartialType(CreatePedidoPlatoDto) {}
