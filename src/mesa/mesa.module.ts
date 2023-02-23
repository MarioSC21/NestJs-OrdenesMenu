import { Module } from '@nestjs/common'
import { MesaService } from './mesa.service'
import { MesaController } from './mesa.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Mesa } from './entities/mesa.entity'

@Module({
  controllers: [MesaController],
  providers: [MesaService],
  imports: [TypeOrmModule.forFeature([Mesa])],
  exports: [MesaService, TypeOrmModule]
})
export class MesaModule {}
