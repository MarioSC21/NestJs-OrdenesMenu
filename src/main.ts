import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('bootstrap')

  app.enableCors()

  // app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      // transform: true,
      // forbidUnknownValues: false,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  // Documentacion con Swagger
  const config = new DocumentBuilder()
    .setTitle('Pedidos de Mesa API')
    .setDescription('API para el manejo de pedidos de mesa')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, document)

  await app.listen(process.env.PORT || 3500)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
