<h1 style="align-text:center;">WordTyping</h1>

一个简单的同时练习打字与英语的前端软件, 这个软件的灵感来自于[Qwerty Learner](https://qwerty.kaiyi.cool/).


## 部署

第一次启动时需要安装依赖
```
npm install
```

使用如下命令启动
```
npm run start
```

## 调试

编译 TypeScript 需要安装前置(示例代码为全局安装)

```
npm install -g typescript
```

更新 TypeScript 代码后需要重新编译

```
tsc
```

### 使用Visual Studio Code

#### 调试后端

需要安装依赖(自动重载), (示例代码为全局安装)
```
npm install -g nodemon
```

然后直接在运行和调试中启用 `调试后端(自动重载)` 即可调试

#### 调试前端

取消注释 `tsconfig.json` 中的 `"sourceMap": true`

需要安装 Visual Studio Code 插件 [JavaScript Debugger](https://marketplace.visualstudio.com/items?itemName=ms-vscode.js-debug).

然后在调试中用 `调试前端` 即可调试