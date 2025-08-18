import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HealthModule } from './common/health/health.module';
import { ConfigModule } from './config/config.module';
import { CounterModule } from './counter/counter.module';
import { ShortestUrlController } from './shortest-url/create-shortest-url/shortest-url.controller';
import { ShortestUrlModule } from './shortest-url/shortest-url.module';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    HealthModule,
    CounterModule,
    ShortestUrlModule,
  ],
  controllers: [AppController, ShortestUrlController],
  providers: [AppService],
})
export class AppModule {}
