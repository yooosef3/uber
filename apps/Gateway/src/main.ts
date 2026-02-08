import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { setupSwagger } from './config/swagger.config';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';
const serviceOptions: any = config.get('server');
async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.use(cookieParser());
  setupSwagger(app, config);
  await app.listen(serviceOptions.port);
  console.log(`server running on server ${serviceOptions.port}`);
}
bootstrap();
