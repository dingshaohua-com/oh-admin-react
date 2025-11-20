import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordLoginDto, EmailLoginDto } from './dto/auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('认证')
@ApiExtraModels(PasswordLoginDto, EmailLoginDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: '用户登录',
    description: '支持密码登录和邮箱验证码登录两种方式',
  })
  @ApiBody({
    description: '登录信息',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(PasswordLoginDto) },
        { $ref: getSchemaPath(EmailLoginDto) },
      ],
    },
  })
  login(@Body() loginDto: PasswordLoginDto | EmailLoginDto) {
    return this.authService.login(loginDto);
  }
}
