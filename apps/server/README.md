## 项目架构
基于 nestjs cli 创建！

## orm
orm 并没有使用官方推荐的[TypeORM](https://docs.nestjs.cn/techniques/sql)，而是使用了[Prisma](https://docs.nestjs.cn/recipes/prisma)！

### 安装与初始化
```
pnpm add prisma -D
pnpm dlx prisma init
```

执行完毕后，该命令会创建一个包含以下内容的 prisma 目录：   
`schema.prisma`：指定数据库连接并包含数据库模式   
`.env`：一个 dotenv 文件，通常用于将数据库货其它配置的环境变量  
`prisma.config.ts`：prisma 配置文件

注意的是，需要删除`prisma.config.ts`，否则后续步骤会失败！

### 设置prisma数据库连接
.env配置如下
```sh
DATABASE_URL="mysql://用户名:密码@主机:端口/数据库"
```

schema.prisma配置如下
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```



### prisma生成模型
以下命令会根据数据库中的表结构生成模型到项目中（`prisma/schema.prisma`）
```sh
pnpm dlx prisma db pull
```

如果您没有数据库表结构，可以走反向工程的工作流，即手动在 `prisma/schema.prisma`中定义模型，然后执行以下命令将模型同步到数据库中（这里有[官方指引](https://docs.nestjs.cn/recipes/prisma#%E4%BD%BF%E7%94%A8-prisma-migrate-%E5%88%9B%E5%BB%BA%E4%B8%A4%E4%B8%AA%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A1%A8)）：
```sh
npx prisma migrate dev --name init
```


### 生成并使用prisma客户端
Prisma Client会根据您的模型生成 dao 层代码（即封装了 crud 的操作）。  

安装过程中 Prisma 会自动为您调用 prisma generate 命令
```sh
pnpm add @prisma/client
```

或者您也可以手动调用（主要是针对后续更新模型后 需要再次生成）
```sh
pnpm dlx prisma generate
```

`prisma generate` 命令会读取您的 Prisma 架构，并更新位于 `node_modules/@prisma/client` 中的生成 Prisma 客户端库。

最后我们使用客户端
```ts
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();
prisma.user.update({...})
```

### 优雅的使用prisma客户端
我们创建prisma.service.ts来管理prisma客户端的生命周期，并且将其注册为nestjs的provider，然后在需要使用的地方注入即可！
(为方便演示，我还创建了个UserController，用来调用，所以这里也显式注册到app.module.ts的controllers中)

app.module.ts
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from 'src/user/user.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
```

prisma.service.ts
```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

最后在user.controller.ts中使用
```ts
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
```

现在试试效果 http://localhost:3000/user


## 集成 openApi
官方指引：https://docs.nestjs.cn/openapi
