import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { Environment } from '../config/env.validation';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { LoggingInterceptor } from './logging/logging';
import { LoggingMiddleware } from './logging/logging.middleware';
import { MetricMiddleware } from './metric/middleware.metric';
import { RequestValidationPipe } from './validation/request-validation';

@Module({
  imports: [TerminusModule, PrometheusModule.register(), HealthModule],
  controllers: [HealthController, HealthController],
  providers: [
    Logger,
    { provide: APP_PIPE, useClass: RequestValidationPipe },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    if (process.env.NODE_ENV != Environment.Testing) {
      consumer.apply(LoggingMiddleware).forRoutes('*');
      consumer.apply(MetricMiddleware).exclude('/metrics').forRoutes('*');
    }
  }
}
