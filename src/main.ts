import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes( // with this i don't need to add ValidationPipe in each controller separately
    new ValidationPipe({ // validation pipe to validate incoming requests for all controllers
      whitelist: true,        
      forbidNonWhitelisted: true, 
      transform: true,        
    }),
  );


  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
