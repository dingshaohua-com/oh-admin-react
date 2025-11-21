import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getHello(): Promise<string> {
    // 测试：先设置一个值
    await this.cacheManager.set('hello', 'Hello from cache(redis)!', 60000);

    // 然后读取
    const res = await this.cacheManager.get('hello');

    // 如果缓存中有值，返回缓存的值，否则返回默认值
    return res ? (res as string) : 'Hello World!';
  }
}
