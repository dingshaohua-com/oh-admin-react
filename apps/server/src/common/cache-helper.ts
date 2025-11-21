import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

export function getCacheModule() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return CacheModule.registerAsync({
    useFactory: () => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        stores: [createKeyv('redis://66.112.211.55:6379:6379')],
      };
    },
  });
}
