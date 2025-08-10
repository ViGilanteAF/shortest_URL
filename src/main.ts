import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setUpSwagger } from './common/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: winstonLogger });
  const config = app.get(ConfigService);

  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.use(helmet());
  setUpSwagger(app);

  const PORT = app.get(ConfigService);
  await app.listen(config.get('port'));
}
bootstrap();
