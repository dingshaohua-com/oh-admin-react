import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsEmail, Matches, IsNotEmpty } from 'class-validator';

// 定义枚举
export enum LoginType {
  PASSWORD = 'password',
  EMAIL = 'email',
}

// 密码登录 DTO
export class PasswordLoginDto {
  @ApiProperty({
    description: '登录类型',
    enum: [LoginType.PASSWORD],
    default: LoginType.PASSWORD,
  })
  @IsEnum(LoginType)
  loginType: LoginType.PASSWORD;

  @ApiProperty({
    description: '账户（用户名或邮箱）',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty({ message: '账户不能为空' })
  @Matches(/^\S+$/, { message: '账户不能为空' })
  account: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Matches(/^\S+$/, { message: '密码不能为空' })
  password: string;
}

// 邮箱验证码登录 DTO
export class EmailLoginDto {
  @ApiProperty({
    description: '登录类型',
    enum: [LoginType.EMAIL],
    default: LoginType.EMAIL,
  })
  @IsEnum(LoginType)
  loginType: LoginType.EMAIL;

  @ApiProperty({
    description: '邮箱',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({
    description: '验证码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: '验证码不能为空' })
  @Matches(/^\S+$/, { message: '验证码不能为空' })
  code: string;
}
