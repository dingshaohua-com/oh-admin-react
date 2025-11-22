import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CoreModule } from 'src/core/core.module';
import { getCacheModule } from 'src/common/cache-helper';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { VerificationModule } from 'src/modules/verification/verification.module';

@Module({
  imports: [CoreModule, UserModule, AuthModule, VerificationModule, getCacheModule()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
