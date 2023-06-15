# npm run dev
启动开发服务器

# npm run build
构建打包

# npm run test
进行单元测试


# 项目基础架构介绍

## 项目结构

```shell
├─babel.config.cjs     babel 配置
├─index.html           index.html 是 vite 入口文件
└─src
│   ├─components       组件
│   ├─common
│   │  BasicContext.ts   基础信息上下文
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

## .env
>.env 文件为项目提供环境变量，你可以通过 `import.meta.env.VITE_xxx` 的形式文件中添加的属性，在生产构建时会直接被替换成字符串。
>
>想了解更多关于 env 的内容可以访问 https://cn.vitejs.dev/guide/env-and-mode.html


## 属性含义介绍

> VITE_BASE_URL - 开发和生产环境服务的公共基础路径。如果开发和生产环境的公共路径不一样时可以分别在 .env.development、.env.production 文件中配置 VITE_BASE_URL。项目中使用 `import.meta.env.BASE_URL` 访问公共路径。
>
> VITE_VITE_TITLE - 网站标题
>
> VITE_SUBTITLE - 网站副标题
>
> VITE_THEME_COLOR - 主题色



## 路由配置（分为三个部分）
> 用户登录、密码修改、用户注册（暂无）
> 页面（分为菜单页面和非菜单页面）
> 404 页面
```js
  [
    // 用户没有访问权限时也同样跳转 404
    {
      path: '/',
      element: <MainLayout />,
      children: [
        ...
        {
          path: '/404',
          element: React.createElement(LazyLoader(() => import('../pages/404'), {}, { requiresAuth: false })),
        }
      ],
    },
    // 用户访问的页面不存在时跳转到 404
    {
      path: '*',
      element: React.createElement(LazyLoader(() => import('../pages/404'), {}, { requiresAuth: false })),
    }
  ]
```
## 路由守卫
在 `@/component/BasePage` 组件中进行路由守卫。注意，路由守卫是针对需要登录的页面才会进行，对于无须登录的页面的是不会执行路由守卫的。


## 强制登录
你可以查看路由配置，其中 `requiresAuth` 就表示该页面是否需要用户登录，对于配置 `requiresAuth: true` 的页面，如果用户访问该页面时还未登录，则会重定向至登录页面。


## Token 失效
> 对于需要用户登录的页面，在访问该页面时会验证本地缓存中是否存在 Token，如果 Token 不存在强制用户先登录。
>
> 接口也会验证请求所携带的 `Authorization`，如果接口返回 401 或者 code 等于 401，则跳转至登录页面强制用户登录。


## 访问 url="/" 的页面
> 如果用户已经登录，并且本地已经缓存了用户信息（`USER_INFO`），则此访问 "/" 时，则会重定向到 `homeURL` 页面；
>
> 如果用户已经登录，但是本地缓存中没有保存用户信息（这种情况一般不会发生，一般情况下考虑到开发人员手动删除），则会先跳转至登录页面，在登录页面进行自动处理（获取用户信息，并缓存至本地），处理完成后直接跳转至 `homeURL` 页面；
>
> 最后一种情况，就是用户还未登录，此时就会直接重定向到登陆页面。


## 数据管理（`@/models`）
> 这里我将项目中的数据分了两种，一种是 main（`@/models/index.ts` 文件中的数据），另一种是各个页面所对应的数据管理了。
>
> 对于 main 是通过高阶组件 LazyLoader 绑定的，并传递给每一个页面组件，所以在页面组件中可以通过 `props` 访问所有 mian 中定义的方法和属性。
>
> 非 main 的数据则需要通过 `react-redux` 的 `connect(mapStateFromProps, mapDispatchFromProps)` 绑定到页面，之后才能访问。


## 基础信息上下文（BasicContext）
> 基础信息上下文中保存了用户信息，用户访问权限，菜单列表、网站首页 url、我们通过导出的 `useBasicContext` 可以访问、更新基础信息。
>
> 当前，项目更新 basicContext 的有两处，一处在登录页面，另一处在 `<BasePage />` 组件中，每次更新都可以同步更新本地缓存的用户信息（必须要条件是更新信息中包含 userInfo）。
>
> 用户访问权限，菜单列表、网站首页 url，以上这些信息都是基于 main（`@/models/index.ts`）中 queryUserInfo 接口返回的用户信息进行计算得出的。所以更新的同时 main 中的 userInfo 也同样会更新。


## 公共路径，路由跳转等设置
> 网站公共路径是基于 `import.meta.env.BASE_URL`，如果你需要配置，请在 .env 文件中修改 VITE_BASE_URL 的值
>
> 如果你在组件之外的地方进行路由跳转，此时应该是无法使用 `useNavigate` 钩子，项目在 `@/utils` 中封装了 `historyPush` 和 `historyReplace` 方法可以使用，不要使用其他方法，因为项目的路由都基于公共路径进行，其他访问可能会导致异常。
>
> 使用 `react-router` 提供的 `useNavigate` 钩子函数时，在进行路由跳转时不需要在 url 的前面添加公共路径。


## 主题色
网站的主题色配置可以在 .env 文件中通过 VITE_THEME_COLOR 进行设置的，然后在 vite.config.ts 中 preprocessOptions.less.modifyVars 进行添加
```js
{
  css: {
    ...
    preprocessorOptions: {
      less: {
        modifyVars: {
          themeColor: env.VITE_THEME_COLOR,
        },
        globalVars: {},
        additionalData: '',
        javascriptEnable: true,
      }
    },
  },
}
```
> 添加成功后，就可以在 less 文件中通过 @themeColor 进行访问了。如果你需要添加其他的一些主题设置，可以自行在 .env 中添加。


## 网站标题、网站描述、关键字
标题、描述、关键字这些内容同样在 .env 文件中进行设置。


## Git 规范
### 分支规范
#### 主干分支 master
> master 主干分支不用于开发作业，同时 master 分支也作为预备分支；
>
> 我们可以将上线后的 release 稳定版本合并至 master 分支；
>
> release、dev、hotfix、feature 分支是基于 master 分支进行创建；


#### 预发布分支 release
> release 作为预发布分支，合并需要进行打包发布的 feature/xxx 分支。稳定后再合并至 master；
>
> 所有需要打包发布的 feature/xxx 分支，必须先合并到 dev 分支进行提测，测试验证完成方才可以合并到 release 分支；
>
> release 分支命名规则：release/[YYYY-MM-DD]
>
> `YYYY-MM-DD` 表示年月日，比如 release/2023-07-07 这种可以很直观的表达项目上线日期，查看日志时也一目了然。
>

**注意，这里我们为什么不直接将 dev 分支合并至 release 分支？？？**
> 这是因为 dev 分支永远是功能最新最全的，不能确保 dev 分支所有的内容都被测试通过，
>
> 或者说存在这样一种情况，测试同学在测试的过程中又有新的代码被合并到了 dev 分支，但是这部分代码并没有被打包到测试环境；
>
> 从而导致该功能没有进行提测。一般针对这种人为的行为我们无法百分百的避免；
>
> 所以才不能直接将 dev 分支合并到 release。
>

#### 开发分支（提测分支）dev
> dev 分支基于 master 分支进行创建；
>
> dev 分支不可直接进行开发，主要用作功能提测；
>
> 开发人员将需要提测的内容合并至 dev 分支，然后进行提测。

#### 功能分支 `feature/[name]-[developer]`
> feature 基于 master 分支进行创建，作为新功能开发的分支；
>
> 功能分支的命名规则：feature/[name]-[developer]
>
> [name] 表示开发的功能名称；
>
>


#### 热修复分支`hotfix/[name]`
> 热修复分支用于及时修复线上 bug 的分支存在，
>
> 当线上出现问题，需要及时的修复，此时直接基于 master 分支创建一个 hotfix 分支；
>
> 分支命名规则：hotfix/[name]
>
> [name] 表示要修复的 bug 名称，简单明了即可。
>

**hotfix 发布流程**
> 一般的 hotfix 发布可以夹在大版本发布时一同发上去；
>
> 如果是特别紧急的情况，负责人员需要联系你的直属 Leader，在允许的情况下，允许的时间节点进行发布;
>
> hotfix 分支测试通过后，合并到目标 release 分支，然后进行打包发布。
>
> 切勿进行打包发布；
>

### 代码提交流程和规范

#### git add [filename] | [.]
> 将修改、添加、删除的内容添加到暂存区（待提交）
>
> `git add filname` 表示添加单个文件
>
> `git add .` 表示添加所有修改的内容（推荐）
>

**撤销某个文件的添加**
> 一般当我们添加使用 `git add .` 后，所有被修改的内容都将被添加到暂存区；如果其中包含了我们不想提交的文件（a.js）；
>
> 此时执行 `git reset a.js`，之后该文件就会从暂存区中删除（从暂存区回到了工作区）；
>
> 如果该文件是本次提交刚刚创建的，上面命令执行后再执行 `git clean -df` 就会将该文件删除。


#### git commit -m '[type]: [message]'
> 将暂存区中的内容添加到本地仓库；
>
> [type] 表示本次提交的类型
>

```bash
# feat     - 提交新功能
# fix      - 修复了bug
# docs     - 只修改了文档
# style    - 调整代码格式，未修改代码逻辑（比如修改空格、格式化、缺少分号等）
# refactor - 代码重构，既没修复bug也没有添加新功能
# perf     - 性能优化，提高性能的代码更改
# test     - 添加或修改代码测试
# ci       - 对构建流程或辅助工具和依赖库（如文档生成等）的更改
```
>
> [message] 表示本次提交的信息，注意，信息内容一定要简单命令，对于英文字母全部小写；
>

#### git push
> 将本地仓库中的内容全部 push 到远程仓库；
>
> 如果本地分支与远程分支还没有进行关联，请使用 `git push -u origin [local-branch] [remote-branch]`，一般第一次代码提交时使用该命令；
>
> 如果本地分支与远程分支已关联，请使用 `git push`
>



### 代码合并规范
> 代码合并有两种方式，rebase 和 merge，我们在项目推荐采用 rebase 的方式来合并代码；
>
> 这是因为使用 rebase 进行合并时，不会生成新的记录，同时也不会变基；
>
> 而使用 merge 进行代码合并，不仅会产生新的合并记录（类似："merge branch dev into master"），同时也会在提交记录 graph 中生成多条 flow line；
>
> 另外，当我们再进行合并操作之前，请确保我们的本地分支是干净的，否则你需要将代码通过 `git commit` 提交到本地仓库。
>

#### git fetch [remote] [branch]
> 第一步、拉取远程仓库代码到本地，注意，这个命令只负责获取代码，并不会与我们本地的代码进行合并。
>
> [remote] 表示远程仓库名称
>
> [branch] 表示目标仓库
>
> 你也可以使用 `git fetch` 命令，表示获取所有的远程分支代码。
>

#### git rebase [remote]/[branch]
> 第二部、将获取到的代码与本地的代码进行合并；`[remote]/[branch]` 表示第一步中获取的远程仓库代码的地址；
>
> 代码在合并过程中可能会产生冲突，这个会在第三步中进行解释；
>

#### 解决冲突，重新提交
> 第三步、合并过程中如果出现了代码冲突，我们要做的就是先解决冲突；
>
> 然后是依次执行 `git add .` 和 `git rebase --continue`；
>
> 一般通过上面的操作后，代码冲突就已经被解决了;
>
> 但有时也会存在还有冲突的情况，此时我们就需要再次解决冲突，再依次执行 `git add .` 和 `git rebase --continue`；
>

#### 推送到远程仓库
> 最后，可以将合并后的代码通过 `git push` 命令提交到远程仓库。
>
> 但在推送之前，我们还需要先拉取一下远程分支代码并合并。流程如下：
>
```bash
# 先拉取远程所有分支代码
git fetch;
# 合并目标分支代码（远程），如果这一步产生了冲突需要解决冲突
git rebase origin/master;
# 获取并合并远程分支的最新代码
git pull --rebase;
# 最后才是推送
git push;
```
>
> 当然，如果你不想提交，也可以直接进行开发，我们推荐你先将代码提交到远程仓库然后再进行开发作业。
>

#### 取消合并
> 对于合并操作，我们可以使用 `git rebase --abort` 命令进行取消。
>
> 取消合并后，你本地代码将回到合并操作之前的状态。
>


### 查看日志
- `git log`
> 查看当前分支的提交记录；
>
> 如果当前分支代码进行了硬回退（回滚），那么当你的代码回滚到某个指定的 commit-id 版本后；
>
> 此版本之后的提交记录将不再显示。

- `git log --graph`
> 查看当前分支的提交记录(以图形的形式)

- `git reflog`
> 查看当前分支的所有提交记录。与 `git log` 有所不同，该命令是查看所有的日志。

### 代码回滚
- `git reset --hard HARD^`
> 表示将当前分支代码回滚到最近一次提交时的状态。
>
> 回滚后，当前分支代码的所有改动将被撤销。
>
> 回滚操作只影响本地的代码，远程分支代码并不会收到影响，除非执行 `git push` 操作。

- `git reset --hard [commit-id]`
> 表示将当前分支代码回滚到指定 commit 提交时的状态。
>
> 回滚后，当前分支代码在这之后的所有改动将被撤销。
>
> 回滚操作只影响本地的代码，远程分支代码并不会收到影响，除非执行 `git push` 操作。
>
