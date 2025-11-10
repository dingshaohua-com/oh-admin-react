import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user') // 在这里定义路径前缀
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getHello(): any {
    const res = this.prisma.user.findMany();
    return res;
  }
}
