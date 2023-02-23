import { Module } from '@nestjs/common'
import { PlatoService } from './plato.service'
import { PlatoController } from './plato.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Plato } from './entities/plato.entity'
import { CategoriaModule } from 'src/categoria/categoria.module'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'
import { Imagenes } from './entities/images.entity'

@Module({
  controllers: [PlatoController],
  providers: [PlatoService],
  imports: [
    TypeOrmModule.forFeature([Plato, Imagenes]),
    CategoriaModule,
    CloudinaryModule
  ],
  exports: [PlatoService, TypeOrmModule]
})
export class PlatoModule {}
