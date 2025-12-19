import { templates } from 'src/common/mailer-helper';
import { MailerService } from '@nestjs-modules/mailer';
import { VerificationType } from './dto/verification.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, BadRequestException, Logger } from '@nestjs/common';

// 引入你的 React 组件

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);
  private readonly CODE_TTL = 5 * 60 * 1000; // 验证码有效期：5分钟（毫秒）
  private readonly MAX_RETRY = 5; // 最大重试次数

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}

  /**
   * 发送验证码通用接口
   * @param email 邮箱地址
   * @param type 业务场景 (登录、改密、换绑...)
   */
  async sendCode(email: string, type: VerificationType): Promise<{ success: boolean; message: string }> {
    console.log('呵呵');
    
    // 1. 生成验证码
    const code = this.generateCode();

    // 2. 构建 Redis key
    const cacheKey = this.getCacheKey(email, type);

    // 3. 检查是否频繁发送（1分钟内只能发送一次）
    const rateLimitKey = `${cacheKey}:rate_limit`;
    const rateLimitExists = await this.cacheManager.get(rateLimitKey);
    if (rateLimitExists) {
      throw new BadRequestException('发送过于频繁，请稍后再试');
    }

    // 4. 存储验证码到 Redis
    await this.cacheManager.set(cacheKey, code, this.CODE_TTL);

    // 5. 设置频率限制（1分钟）
    await this.cacheManager.set(rateLimitKey, '1', 60 * 1000);

    // 6. 初始化重试次数
    const retryKey = `${cacheKey}:retry`;
    await this.cacheManager.set(retryKey, 0, this.CODE_TTL);

    // 7. 发送验证码（这里暂时只打印日志，实际应该调用邮件服务）
    this.logger.log(`发送验证码到邮箱 ${email}，业务场景：${type}，验证码：${code}`);
    // TODO: 集成邮件服务
    await this.mailerService.sendMail(templates.login({ to: email, code }));

    return {
      success: true,
      message: '验证码已发送，请查收邮件',
    };
  }

  /**
   * 校验验证码 (提供给其他模块调用)
   * @param email 邮箱地址
   * @param code 用户输入的验证码
   * @param type 业务场景
   * @returns 校验是否成功
   */
  async verifyCode(email: string, code: string, type: VerificationType): Promise<boolean> {
    const cacheKey = this.getCacheKey(email, type);
    const retryKey = `${cacheKey}:retry`;

    // 1. 检查重试次数
    const retryCount = (await this.cacheManager.get<number>(retryKey)) || 0;
    if (retryCount >= this.MAX_RETRY) {
      // 删除验证码，防止继续尝试
      await this.cacheManager.del(cacheKey);
      await this.cacheManager.del(retryKey);
      throw new BadRequestException('验证码错误次数过多，请重新获取');
    }

    // 2. 获取存储的验证码
    const storedCode = await this.cacheManager.get<string>(cacheKey);

    if (!storedCode) {
      throw new BadRequestException('验证码已过期或不存在，请重新获取');
    }

    // 3. 校验验证码
    if (storedCode !== code) {
      // 增加重试次数
      await this.cacheManager.set(retryKey, retryCount + 1, this.CODE_TTL);
      throw new BadRequestException(`验证码错误，还可以尝试 ${this.MAX_RETRY - retryCount - 1} 次`);
    }

    // 4. 验证成功，删除验证码（一次性使用）
    await this.cacheManager.del(cacheKey);
    await this.cacheManager.del(retryKey);

    this.logger.log(`验证码校验成功：${email}，业务场景：${type}`);
    return true;
  }

  /**
   * 生成随机验证码
   * @returns 6位数字验证码
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 构建 Redis 缓存 key
   * @param email 邮箱
   * @param type 业务场景
   * @returns Redis key
   */
  private getCacheKey(email: string, type: VerificationType): string {
    return `verify:${type}:${email}`;
  }
}
