import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {


  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: `${process.env.SERVER_ADDRESS}:${process.env.FRONTEND_PORT}`,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  await app.listen(process.env.PORT??3000);

  
}
bootstrap();
