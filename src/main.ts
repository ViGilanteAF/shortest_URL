import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { serverConfig } from './config/server.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: winstonLogger });
  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.use(helmet());
  setUpSwagger(app);

  const PORT = app.get(serverConfig.KEY).port;
  await app.listen(3000);
}
bootstrap();
