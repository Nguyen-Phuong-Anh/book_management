import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()
    const req = ctx.getRequest<Request>()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const errorResponse = {
      statusCode: status,
      message: exception instanceof HttpException ? exception.getResponse() : 'Internal server error',
      path: req.url,
      timestamp: new Date().toISOString()
    }

    res.status(status).json(errorResponse)
  }
}
