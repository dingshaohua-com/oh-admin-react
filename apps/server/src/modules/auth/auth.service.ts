import * as crypto from 'crypto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordLoginDto, EmailLoginDto, LoginType } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * 用户登录
   * 使用联合类型，TypeScript 可以根据 loginType 自动推断出对应的字段类型
   */
  async login(loginDto: PasswordLoginDto | EmailLoginDto) {
    if (loginDto.loginType === LoginType.PASSWORD) {
      return this.passwordLogin(loginDto.account, loginDto.password);
    } else if (loginDto.loginType === LoginType.EMAIL) {
      return this.emailLogin(loginDto.email, loginDto.code);
    }
  }

  // 密码登录
  private async passwordLogin(account: string, password: string) {
    // 通过用户名或邮箱查找用户
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: account }, { email: account }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 验证密码
    const salt = user.salt || '';
    const hashedPassword = this.hashPassword(password, salt);
    if (hashedPassword !== user.password) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 返回用户信息（不包含敏感信息）
    return {
      success: true,
      message: '登录成功',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  // 邮箱验证码登录
  private async emailLogin(email: string, _code: string) {
    // TODO: 验证验证码（需要实现验证码存储和验证逻辑）
    // 这里暂时简单处理，实际应该从 Redis 或数据库中验证

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('邮箱未注册');
    }

    // 返回用户信息
    return {
      success: true,
      message: '登录成功',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  // 密码加密（使用 salt）
  private hashPassword(password: string, salt: string): string {
    return crypto
      .createHash('sha256')
      .update(password + salt)
      .digest('hex');
  }
}
