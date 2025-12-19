import { SendCodeDto } from './dto/verification.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('send')
  @ApiOperation({
    summary: '发送验证码',
    description: '向指定邮箱发送验证码，支持多种业务场景',
  })
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.verificationService.sendCode(sendCodeDto.email, sendCodeDto.type);
  }
}
