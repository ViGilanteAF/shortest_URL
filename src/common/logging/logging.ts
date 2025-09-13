import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  get logger(): Logger {
    return this._logger;
  }
  constructor(private readonly _logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent');
    const now = Date.now();

    const logFormat = `${method} ${originalUrl} ${ip} ${userAgent}`;
    return next.handle().pipe(
      tap({
        next: () => {
          this._logger.log(`${logFormat} ${Date.now() - now}ms`);
        },
        error: (err) => {
          const errLogFormat = `${logFormat} ${Date.now() - now}ms ${
            err.name
          }: ${err.message()}`;
          err instanceof HttpException &&
          err.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR
            ? this._logger.warn(errLogFormat)
            : this._logger.error(errLogFormat, err.stack);
        },
      }),
    );
  }
}
