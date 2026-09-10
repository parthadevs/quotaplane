import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    
    const message = typeof exceptionResponse === 'object' && exceptionResponse !== null
      ? (exceptionResponse as { message?: string | string[] }).message
      : exceptionResponse;

    response
      .status(status)
      .json({
        statusCode: status,
        message: message ?? 'Internal server error',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
