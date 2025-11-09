## 项目初始架构
基于 [turborepo](https://turborepo.com/docs/guides/frameworks)官方脚手架提供的[with-vite-react](https://github.com/vercel/turborepo/tree/main/examples/with-vite-react)模板来生成的项目！

```sh
pnpm dlx create-turbo@latest -e with-vite-react
```


## 集成prettier
新建了一个单仓 `@repo/prettier-config`，然后在跟项目的prettier配置中继承它！
这里需要注意的是不同于eslint-config的直接使用，prettier-config仍然需要在使用它的地方安装一下，然后再去使用！
> 这里也可得知，不仅仅是兄弟项目，哪怕是父项目使用子项目包，也需要在父项目中安装一下，然后再去使用！
