import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule], // 👈 干净利落，只负责导入模块
  exports: [PrismaModule], // 👈 再次导出，让 App 其他地方可用
})
export class CoreModule {}
