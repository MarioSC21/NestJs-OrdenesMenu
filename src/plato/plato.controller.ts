import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe
} from '@nestjs/common'
import { PlatoService } from './plato.service'
import { CreatePlatoDto } from './dto/create-plato.dto'
import { UpdatePlatoDto } from './dto/update-plato.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('plato')
export class PlatoController {
  constructor(private readonly platoService: PlatoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPlatoDto: CreatePlatoDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.platoService.create(createPlatoDto, file)
  }

  @Get()
  findAll() {
    return this.platoService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platoService.findOne(id)
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlatoDto: UpdatePlatoDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.platoService.update(id, updatePlatoDto, file)
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.platoService.remove(id)
  }
}
