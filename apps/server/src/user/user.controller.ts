import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { GetUserDto } from './dto/user.dto';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOkResponse({
    description: '获取用户列表成功',
    type: [GetUserDto],
  })
  getUsers(): Promise<GetUserDto[]> {
    return this.prisma.user.findMany({
      omit: {
        salt: true,
        password: true,
      },
    });
  }
}
