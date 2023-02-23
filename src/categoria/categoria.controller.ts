import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { CategoriaService } from './categoria.service'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { ParseUUIDPipe } from '@nestjs/common/pipes'

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto)
  }

  @Get()
  findAll() {
    return this.categoriaService.findAll()
  }

  @Get(':id/platos')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriaService.findOnePlatoCategoria(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto
  ) {
    return this.categoriaService.update(id, updateCategoriaDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriaService.remove(id)
  }
}
