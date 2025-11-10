import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user as User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
