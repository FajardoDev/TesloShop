import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // http://localhost:3000/api/products

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // Transform DTOs
      //  transform: true,
      //  transformOptions: {
      //    enableImplicitConversion: true,
      //  },
    }),
  );

  await app.listen(3000);
}
bootstrap();
