import { ApiProperty } from '@nestjs/swagger';

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

