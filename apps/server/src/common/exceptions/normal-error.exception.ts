import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 业务异常类
 * 用于业务逻辑错误，HTTP 状态码为 200，但响应体中的 code 为 1
 */
export class NormalError extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.OK);
  }
}
