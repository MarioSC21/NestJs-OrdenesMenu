import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriaModule } from './categoria/categoria.module'
import { MesaModule } from './mesa/mesa.module'
import { PlatoModule } from './plato/plato.module'
import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { PedidoModule } from './pedido/pedido.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      //conexion certificada
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true // solo en desarrollo
    }),
    CategoriaModule,
    MesaModule,
    PlatoModule,
    CloudinaryModule,
    PedidoModule,
    AuthModule
  ]
})
export class AppModule {}
