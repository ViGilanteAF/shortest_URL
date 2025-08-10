import { RequestValidationPipe } from './validation/request-validation';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthController } from './health/health.controller/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule, PrometheusModule.register()],
  controllers: [HealthController, HealthController],
  providers: [
    Logger,
    { provide: APP_PIPE, useClass: RequestValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    if (process.env.NODE_ENV != Environment.Test) {
      consumer.apply(LoggingMiddleware).forRoutes('*');
      consumer.apply(MetricMiddleware).exclude('/metrics').forRoutes('*');
    }
  }
}
