import { Module } from '@nestjs/common'
import { SeedService } from './seed.service'
import { SeedController } from './seed.controller'
import { AuthModule } from 'src/auth/auth.module'
import { MesaModule } from 'src/mesa/mesa.module'
import { PlatoModule } from 'src/plato/plato.module'
import { CategoriaModule } from 'src/categoria/categoria.module'
import { PedidoModule } from 'src/pedido/pedido.module'

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [AuthModule, MesaModule, PlatoModule, CategoriaModule, PedidoModule]
})
export class SeedModule {}
