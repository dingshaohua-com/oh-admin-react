import { ApiProperty } from '@nestjs/swagger';

/**
 * 统一响应格式
 */
export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: '状态码',
    example: 200,
    type: Number,
  })
  code: number;

  @ApiProperty({
    description: '响应数据',
  })
  data: T;

  @ApiProperty({
    description: '响应消息',
    example: 'success',
    type: String,
  })
  msg: string;
}

/**
 * 存在性检查响应 DTO
 * 用于检查用户名、邮箱等资源是否已存在的接口响应
 */
export class ExistsResponseDto {
  @ApiProperty({
    description: '是否存在',
    example: true,
    type: Boolean,
  })
  exists: boolean;
}

