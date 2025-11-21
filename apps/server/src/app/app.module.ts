import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/modules/user/user.module';
import { CoreModule } from 'src/core/core.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { getCacheModule } from 'src/common/cache-helper';
@Module({
  imports: [CoreModule, UserModule, AuthModule, getCacheModule()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
