<!--
 * @Author: WangNing
 * @Date: 2022-12-27 14:36:37
 * @LastEditors: WangNing
 * @LastEditTime: 2023-01-17 16:33:07
 * @FilePath: /hz-map-tools/README.md
-->

# hz-map-tools

海致 Gis 地图辅助工具

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### 代码提交规范

build 影响项目构建或依赖项修改
chore 其他修改
ci 持续集成相关文件修改
docs 文档修改
feat 添加新功能
fix 修复 bug
perf 更改代码，以提高性能
refactor 代码重构
revert 恢复上一次提交
style 代码格式修改
test 测试用例新增、修改

### lint-stage 校验报错后代码不在暂存区？

lint-staged 从 v10.0.0 起，使用 git stash 来提高速度并在运行时提供备份，使用 git stash pop 取出代码，修改问题后再提交
详情： https://github.com/okonet/lint-staged/pull/724

### element-plus icon 怎么用？

项目已配置自动导入 element-plus icon，复制 icon 名(不限大小写)，<i-ep-icon 名>即可
icon 最佳实践：https://github.com/sxzz/element-plus-best-practices
自动导入方式比官网推荐全局注册方式构建体积小 200k 左右
