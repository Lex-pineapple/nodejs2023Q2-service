import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggingService } from 'src/log/log.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggingService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    let status = exception.getStatus();
    let exceptionMessage = exception.message;
    if (exception instanceof HttpException) {
    } else {
      status = 500;
      exceptionMessage = 'Internal server error';
    }
    const errorMessage = `Message: ${exceptionMessage} - Status Code: ${status}`;
    this.logger.error(errorMessage);

    const responseBody = {
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(req),
    };

    httpAdapter.reply(res, responseBody, status);
  }
}
