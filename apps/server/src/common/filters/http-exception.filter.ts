import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { NormalError } from '../exceptions/normal-error.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务端报错';

    if (exception instanceof NormalError) {
      // NormalError 是业务异常，HTTP 状态码为 200
      status = HttpStatus.OK;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message || 'Error';
        // ValidationPipe 验证失败时，message 可能是数组，需要处理
        if (Array.isArray(message)) {
          // 如果是数组，可以取第一个，或者合并所有错误消息
          message = message[0]; // 或者: message.join('; ')
        }
      }
    }

    response.status(status).json({
      code: 1,
      data: null,
      msg: message,
    });
  }
}
