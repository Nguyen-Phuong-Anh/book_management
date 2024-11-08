import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { SuccessResponseInterceptorInterceptor } from './common/interceptors/success-response-interceptor.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { api_ver1 } from './shared/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(api_ver1)
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new SuccessResponseInterceptorInterceptor())
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  const config = new DocumentBuilder()
    .setTitle('Book Management API')
    .setDescription('The books API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(3000);
}
bootstrap();