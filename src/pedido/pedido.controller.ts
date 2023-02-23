import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe
} from '@nestjs/common'
import { PedidoService } from './pedido.service'
import { CreatePedidoDto, UpdatePedidoDto } from './dto'
import { Auth } from 'src/auth/decorators'

@Controller('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto)
  }

  @Get()
  @Auth()
  findAll() {
    return this.pedidoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidoService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto
  ) {
    return this.pedidoService.update(id, updatePedidoDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidoService.remove(id)
  }
}
