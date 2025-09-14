import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { winstonLogger } from './common/logging/winston';
import { setUpSwagger } from './common/swagger/swagger';

import { configServer } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: winstonLogger });
  const config = app.get(configServer.KEY);

  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  app.use(helmet());
  setUpSwagger(app);

  const PORT = app.get(config.PORT);
  await app.listen(config.get('port'));
}
bootstrap();
