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



### 设置数据库连接
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



### 生成模型
以下命令会根据数据库中的表结构生成模型到项目中（`prisma/schema.prisma`）
```sh
pnpm dlx prisma db pull
```

如果您没有数据库表结构，可以走反向工程的工作流，即手动在 `prisma/schema.prisma`中定义模型，然后执行以下命令将模型同步到数据库中（这里有[官方指引](https://docs.nestjs.cn/recipes/prisma#%E4%BD%BF%E7%94%A8-prisma-migrate-%E5%88%9B%E5%BB%BA%E4%B8%A4%E4%B8%AA%E6%95%B0%E6%8D%AE%E5%BA%93%E8%A1%A8)）：
```sh
npx prisma migrate dev --name init
```

