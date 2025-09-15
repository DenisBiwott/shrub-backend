import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true, // if you need cookies/headers
  });
  const port: number = app.get(ConfigService).get('PORT') ?? 5001;
  console.log('Listening on port:', port);
  await app.listen(port);
}
void bootstrap();
