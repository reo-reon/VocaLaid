import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: (exception as Error).message };

    // ValidationPipe の BadRequest は message が配列になる
    const messages =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>)['message']
        : exceptionResponse;

    const logBody = {
      statusCode: status,
      method: request.method,
      url: request.url,
      errors: messages,
      body: request.body,
    };

    if (status >= 500) {
      this.logger.error(
        `[ExceptionFilter] ${request.method} ${request.url} → ${status}`,
        JSON.stringify(logBody, null, 2),
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `[ExceptionFilter] ${request.method} ${request.url} → ${status}\n${JSON.stringify(logBody, null, 2)}`,
      );
    }

    response.status(status).json(
      typeof exceptionResponse === 'object'
        ? exceptionResponse
        : { statusCode: status, message: exceptionResponse },
    );
  }
}
