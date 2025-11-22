import { Prisma, user as User } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto implements Prisma.userCreateInput {
  email: string;
  password: string | null;
  username: string | null;
  des: string | null;
  nickname: string | null;
  avatar: string | null;
}

type GetUserType = Omit<User, 'salt' | 'password'>;
export class GetUserDto implements GetUserType {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  role: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  username: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  des: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  nickname: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  avatar: string | null;
}
