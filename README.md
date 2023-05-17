# npm run dev
启动开发服务器

# npm run build
构建打包

# .env
env.json 文件未项目提供环境变量，你可以通过 `import.meta.env[key]`的形式进行反问，在生产构建时会直接被替换成字符串。

想了解更多关于 env 的内容可以访问 https://cn.vitejs.dev/guide/env-and-mode.html

# 项目结构

```shell
├─babel.config.cjs     babel 配置
├─index.html           index.html 是 vite 入口文件
└─src
│   ├─components       组件
│   ├─pages            页面
│   │  user              案例1
│   │  │  ├─user-list
│   │  │  └─role-list
│   │  ├─home            案例2
│   │  └─login           登录页面
│   ├─models
│   │  ├─index           数据模型
│   │  ├─home            home页面的数据
│   │  └─login           login页面的数据
│   ├─routers          项目路由
│   ├─redux            redux 数据状态管理
│   ├─assets           静态文件
│   │  └─images
│   ├─mock             mock 数据
│   ├─vite-env.d.ts    公共ts类型定义
│   └─utils            基础工具包
├─ .env              环境变量定义文件
├─ public            被 index.html 直接引用的资源存放的目录
├─ tsconfig.json     ts 配置文件
├─ .eslintrc.yml     eslint 配置文件
├─ .prettierrc.ts    prettier 配置文件
├─ .gitignore        git 忽略配置
└─ eidtorconfig
```

