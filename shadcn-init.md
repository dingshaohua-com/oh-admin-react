## 集成shadcn
如果你要集成的项目不是nextjs或者vite等，则不能使用`pnpm dlx shadcn init`一步到位的集成方式！


比如你想把涉及到shadcn的相关的都单独的放到一个项目中， 假设的项目叫做 `shadcn-compnts`，是Monorepo（或者Turborepo）中的一个子包 其包名为 `@repo/shadcn-compnts`。我们使用`pnpm init`来初始化它！
```json
{
  "name": "@repo/shadcn-compnts",
  "version": "1.0.0",
  "description": "",
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC",
}

```
那我们接下来如何为这个单独的子包集成shadcn呢？接下来我们教如何手动集成！



### 安装tailwind
因为shadcn是基于tailwindcss的，所以首先我们必须先安装tailwindcss。
```
pnpm add tailwindcss 
```


### 配置tsconfig.json
紧接着项目要有 `tsconfig.json`，因为后边安装shadcn组件的时候依赖ts里的paths配置，
如果没有这个，shadcn组件的安装会直接参考components中aliases给你下载到@repo>shadcn-compnts>components， 而不是根据短链接解析真实路径到src下（如果听不明白，你操作下就知道了）
```JSON
{
  "compilerOptions": {
    "jsx": "react",
    "paths": {
      // @repo/shadcn-compnts 为项目名，即package.json的name属性
      // （如果想把shadcn抽离一个单独的仓库这么指定，如果直接集成到web项目中使用则直接 "@": ["./src/*"] 即可）
      "@repo/shadcn-compnts/*": ["./src/*"]
    }
  }
}

```

### shadcn的配置文件
然后我们创建一个 shadcn的配置文件 `components.json`，比如主题、服务端渲染、图标库以及短链接等
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "./src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@repo/shadcn-compnts/components",
    "utils": "@repo/shadcn-compnts/lib/utils",
    "ui": "@repo/shadcn-compnts/components",
    "lib": "@repo/shadcn-compnts/lib",
    "hooks": "@repo/shadcn-compnts/hooks"
  },
  "registries": {}
}
```

### 辅助工具
`src\lib\utils.ts`创建这一样一个文件，此文件`shadcn init`会自动创建，但是我们手动的时候就需要自己创建了，记得安装此工具用到的依赖包
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 额外的工具包
第一个是shadcn组件内会用到，第二个是防止编辑器报错
```sh
pnpm add class-variance-authority 
pnpm add --D @types/react 
```

### 安装shadcn组件
来吧，我们在 `shadcn-compnts`这个子包中尝试使用shadcn安装一个组件
```sh
pnpm dlx shadcn add button
```