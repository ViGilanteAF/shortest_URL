import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpExceptionFilter) {
    const ctx = new HttpExceptionFilter();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const [status, message] =
      exception instanceof HttpExceptionFilter &&
      exception.getStatus() < HttpStatus.INTERNAL_SERVER_ERROR
        ? [exception.getStatus(), exception.message]
        : [
            HttpStatus.INTERNAL_SERVER_ERROR,
            '서버 오류!! 잠시후 다시 시도 해주세요!',
          ];
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().getTime(),
      path: request.url,
      message,
    });
  }
}
