import {
  IsEnum,
  ValidateIf,
  IsString,
  IsEmail,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 定义枚举
export enum LoginType {
  PASSWORD = 'password',
  EMAIL = 'email',
}
export class LoginDto {
  @ApiProperty({
    description: '登录类型',
    enum: LoginType,
  })
  @IsEnum(LoginType, { message: '登录类型必须是 password 或 email' })
  loginType: LoginType;

  @ApiProperty({
    description: '账户',
    required: false,
  })
  @ValidateIf((o: LoginDto) => o.loginType === LoginType.PASSWORD)
  @IsString()
  @Matches(/^\S+$/, { message: '账户不能为空' })
  account?: string;

  @ApiProperty({
    description: '密码',
    required: false,
  })
  @ValidateIf((o: LoginDto) => o.loginType === LoginType.PASSWORD)
  @IsString()
  @Matches(/^\S+$/, { message: '密码不能为空' })
  password?: string;

  @ApiProperty({
    description: '邮箱',
    required: false,
  })
  @ValidateIf((o: LoginDto) => o.loginType === LoginType.EMAIL)
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: '验证码',
    required: false,
  })
  @ValidateIf((o: LoginDto) => o.loginType === LoginType.EMAIL)
  @IsString()
  @Matches(/^\S+$/, { message: '验证码不能为空' })
  code?: string;
}
