import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

// 业务场景枚举
export enum VerificationType {
  LOGIN = 'login', // 登录
  REGISTER = 'register', // 注册
  FORGOT_PASSWORD = 'forgot_password', // 忘记密码
  CHANGE_EMAIL = 'change_email', // 更换邮箱
  CHANGE_PHONE = 'change_phone', // 更换手机
  SENSITIVE_OPERATION = 'sensitive_operation', // 敏感操作
}

// 发送验证码 DTO
export class SendCodeDto {
  @ApiProperty({
    description: '邮箱地址',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({
    description: '业务场景类型',
    enum: VerificationType,
    example: VerificationType.LOGIN,
  })
  @IsEnum(VerificationType, { message: '业务场景类型不正确' })
  type: VerificationType;
}

// 校验验证码 DTO (内部使用，不暴露为 HTTP 接口)
export class VerifyCodeDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '验证码不能为空' })
  @Matches(/^\d{6}$/, { message: '验证码必须是6位数字' })
  code: string;

  @IsEnum(VerificationType, { message: '业务场景类型不正确' })
  type: VerificationType;
}
