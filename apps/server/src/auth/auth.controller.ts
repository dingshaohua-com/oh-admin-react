import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: '用户登录',
    description: '支持密码登录和邮箱验证码登录两种方式',
  })
  @ApiResponse({
    status: 200,
    description: '登录成功，返回用户信息',
  })
  @ApiResponse({
    status: 401,
    description: '登录失败，用户名/密码错误或邮箱未注册',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
