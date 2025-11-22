import { Module } from '@nestjs/common';
import { getCacheModule } from 'src/common/cache-helper';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';

@Module({
  imports: [getCacheModule()],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
