import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv'
import { UserSeeder } from './modules/seed';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const whiteList = '*';
  const corsOptions: CorsOptions = {
    origin:
      whiteList?.split(',')?.length > 1 ? whiteList.split(',') : whiteList,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Language',
      'X-Timezone',
      'X-Timezone-Name',
      'X-Mssp-Id',
      'X-Organization-Id',
    ],
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  };
  app.enableCors(corsOptions);
  const seedData=app.get(UserSeeder);
  await seedData.seed();
  //await app.listen(3000);
  await app.listen(process.env.PORT || 3000);

}
bootstrap();
