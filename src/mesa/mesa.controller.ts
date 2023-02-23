import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { MesaService } from './mesa.service'
import { CreateMesaDto } from './dto/create-mesa.dto'
import { UpdateMesaDto } from './dto/update-mesa.dto'
import { ParseUUIDPipe } from '@nestjs/common/pipes'

@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesaService.create(createMesaDto)
  }

  @Get()
  findAll() {
    return this.mesaService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesaService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMesaDto: UpdateMesaDto
  ) {
    return this.mesaService.update(id, updateMesaDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mesaService.remove(id)
  }
}
