import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // await ConfigModule.envVariablesLoaded;
  await app.listen(3000);
}
bootstrap().catch((err) => console.log(err));
