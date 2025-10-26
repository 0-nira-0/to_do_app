import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);



    app.useGlobalPipes( // with this i don't need to add ValidationPipe in each controller separately
    new ValidationPipe({ // validation pipe to validate incoming requests for all controllers
      whitelist: true,        
      forbidNonWhitelisted: true, 
      transform: true,        
    }),
  );

  //api
  const config = new DocumentBuilder()
    .setTitle('ToDo')
    .setDescription('ToDo API description')
    .setVersion('1.0.0')
    .addTag('tasks')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser());
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
