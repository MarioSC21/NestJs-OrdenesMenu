import { Module } from '@nestjs/common'
import { PedidoService } from './pedido.service'
import { PedidoController } from './pedido.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Pedido } from './entities/pedido.entity'
import { MesaModule } from 'src/mesa/mesa.module'
import { AuthModule } from 'src/auth/auth.module'
import { PlatoModule } from 'src/plato/plato.module'
import { PedidoPlato } from './entities/pedido-plato.entity'
import { PedidoPlatoController } from './pedidoPlato.controller'
import { PedidoPlatoService } from './pedidoPlato.service'

@Module({
  controllers: [PedidoController, PedidoPlatoController],
  providers: [PedidoService, PedidoPlatoService],
  imports: [
    TypeOrmModule.forFeature([Pedido, PedidoPlato]),
    MesaModule,
    AuthModule,
    PlatoModule,
    AuthModule
  ],
  exports: [PedidoService, PedidoPlatoService, TypeOrmModule]
})
export class PedidoModule {}
