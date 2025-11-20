## 项目架构

基于 nestjs cli 创建！

## orm与 dto

orm 并没有使用官方推荐的[TypeORM](https://docs.nestjs.cn/techniques/sql)，而是使用了[Prisma](https://docs.nestjs.cn/recipes/prisma)！

然后基于prisma生成的类型，手动创建了业务所需的 dto，这里有独立出去的[总结](https://www.cnblogs.com/dingshaohua/p/19239721)。
最后我们在给自定义的 dto 加上一些[参数校验功能](https://docs.nestjs.com/techniques/validation)，这样 service 层就只需要负责业务（逻辑验证（用户是否存在、密码是否正确、验证码是否有效等）、数据处理、流程控制等等）即可，而不用再做类如下部分了！

```ts
// Service 层 - 重复验证
@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    // 重复的格式验证（不应该在这里做）
    if (!loginDto.loginType) {
      throw new Error('登录类型不能为空');
    }
    if (loginDto.loginType === 'password' && !loginDto.account) {
      throw new Error('账号不能为空');
    }
    // ... 更多重复验证
  }
}
```

不过在 service 层，你依然需要断言，因为 Ts 的类型系统是静态分析的，它只能在编译时检查类型。而 class-validator 是运行时验证，在程序执行时才会检查数据的有效性。

```ts
class AuthService {
  async login(loginDto: LoginDto) {
    // 非空断言操作符(!)是安全的，因为 class-validator 已经在请求到达此处之前验证了必填字段
    return this.passwordLogin(loginDto.account!, loginDto.password!);
  }
}
```


另外，我们登录方式是枚举模型，这就是涉及到了多选一的类型情况，可以参考这里[oneOf、anyOf、allOf](https://docs.nestjs.cn/openapi/types-and-parameters#oneofanyofallof)。

完全正确！您理解得很准确。




## 集成 openApi

官方指引：https://docs.nestjs.cn/openapi
