import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const [status, message] =
      exception instanceof HttpException &&
      exception.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR
        ? [exception.getStatus(), exception.message]
        : [
            HttpStatus.INTERNAL_SERVER_ERROR,
            '서버 오류!! 잠시후 다시 시도 해주세요!',
          ];
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().getTime(),
      path: request.path,
      message,
    });
  }
}
