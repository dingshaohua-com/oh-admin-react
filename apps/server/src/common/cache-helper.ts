import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';

export function getCacheModule() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return CacheModule.registerAsync({
    useFactory: () => {
      return {
        stores: [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          createKeyv('redis://66.112.211.55:6379/0', {
            // 如果想去掉 keyv: 前缀，可以设置 namespace 为空字符串
            namespace: '',
          }),
        ],
      };
    },
  });
}
