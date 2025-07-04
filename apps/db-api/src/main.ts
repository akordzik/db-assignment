import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.useGlobalFilters(new GlobalExceptionFilter())

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,PATCH,POST,OPTIONS,DELETE',
    credentials: true,
  })

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = process.env.PORT || 3000
  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()
