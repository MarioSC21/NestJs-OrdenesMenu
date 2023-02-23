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
import { CreatePedidoPlatoDto, UpdatePedidoPlatoDto } from './dto'
import { PedidoPlatoService } from './pedidoPlato.service'

@Controller('pedidoPlato')
export class PedidoPlatoController {
  constructor(private readonly pedidoPlatoService: PedidoPlatoService) {}

  @Post()
  create(@Body() createPedidoPlatoDto: CreatePedidoPlatoDto) {
    return this.pedidoPlatoService.create(createPedidoPlatoDto)
  }

  @Get()
  findAll() {
    return this.pedidoPlatoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidoPlatoService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePedidoPlatoDto: UpdatePedidoPlatoDto
  ) {
    return this.pedidoPlatoService.update(id, updatePedidoPlatoDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pedidoPlatoService.remove(id)
  }
}
