import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'

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

  await app.listen(process.env.PORT || 3500)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
