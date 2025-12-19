import { AuthService } from './auth.service';
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PasswordLoginDto, EmailLoginDto } from './dto/auth.dto';
import { ExistsResponseDto } from 'src/common/dto/response.dto';
import { ApiTags, ApiOperation, ApiExtraModels, ApiBody, getSchemaPath, ApiQuery, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiExtraModels(PasswordLoginDto, EmailLoginDto, ExistsResponseDto)
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
      oneOf: [{ $ref: getSchemaPath(PasswordLoginDto) }, { $ref: getSchemaPath(EmailLoginDto) }],
    },
  })
  login(@Body() loginDto: PasswordLoginDto | EmailLoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('check-username')
  @ApiOperation({
    summary: '检查用户名是否存在',
    description: '用于注册时验证用户名是否已被使用',
  })
  @ApiQuery({ name: 'username', description: '用户名', type: String })
  @ApiOkResponse({ description: '返回用户名是否存在', type: ExistsResponseDto })
  checkUsername(@Query('username') username: string) {
    return this.authService.checkUsernameExists(username);
  }

  @Get('check-email')
  @ApiOperation({
    summary: '检查邮箱是否存在',
    description: '用于注册时验证邮箱是否已被注册',
  })
  @ApiQuery({ name: 'email', description: '邮箱地址', type: String })
  @ApiOkResponse({ description: '返回邮箱是否存在', type: ExistsResponseDto })
  checkEmail(@Query('email') email: string) {
    return this.authService.checkEmailExists(email);
  }
}
