# React Native Demo 📰

> 一个基于 **Expo + React Native + TypeScript** 的移动端新闻 App 示例项目，演示了登录鉴权、路由跳转、列表展示、WebView 详情页以及全局状态管理等常见开发场景。

## 简介

本项目是一个移动端新闻应用 Demo，基于 Expo Router 的文件路由搭建。项目包含完整的**登录 / 注册 → 首页新闻列表 → 新闻详情（WebView）** 主流程，并封装了统一的 HTTP 请求客户端与全局鉴权状态，适合作为学习 Expo / React Native 工程化实践的起步模板。

## 功能特性

- 🔐 **登录 / 注册**：账号密码登录，登录成功后 token 与用户信息自动持久化到本地。
- 🧭 **路由守卫**：启动时根据本地 token 自动重定向（已登录进首页，未登录进登录页）。
- 📰 **新闻列表**：首页以图文列表形式展示新闻（封面图 + 标题 + 摘要），支持点击进入详情。
- 🌐 **新闻详情**：通过 `react-native-webview` 内嵌网页展示原文内容。
- 🔄 **统一的网络层**：基于 axios 封装请求/响应拦截器，自动携带 `Authorization` 头，401 自动登出并跳回登录页。
- 💾 **全局状态管理**：使用 Zustand + AsyncStorage 持久化认证状态。
- 🎨 **主题系统**：内置亮/暗色主题配色、字体与间距常量。
- 🌗 **跨平台**：支持 iOS、Android 与 Web。

## 技术栈

| 分类     | 技术                                                                          |
| -------- | ----------------------------------------------------------------------------- |
| 框架     | [Expo](https://docs.expo.dev/) SDK 57                                         |
| 运行时   | [React Native](https://reactnative.dev/) 0.86 / React 19                      |
| 路由     | [Expo Router](https://docs.expo.dev/router/introduction/)（基于文件的路由）   |
| 语言     | [TypeScript](https://www.typescriptlang.org/)（strict 模式）                  |
| 状态管理 | [Zustand](https://github.com/pmndrs/zustand) + AsyncStorage 持久化            |
| 网络请求 | [axios](https://axios-http.com/)                                              |
| 其他     | react-native-webview、react-native-reanimated、react-native-safe-area-context |

## 快速开始

### 环境要求

- Node.js >= 18
- iOS Simulator / Android Emulator，或安装了 Expo Go 的真机

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
# 或指定平台
npm run ios        # iOS 模拟器（需本地构建）
npm run android    # Android 模拟器（需本地构建）
npm run web        # Web 端
```

> ⚠️ 本项目使用了 `react-native-webview` 等包含原生代码的库，若通过 Expo Go 运行可能受限，建议使用开发构建：
> `npx expo run:ios` / `npx expo run:android`，或 `npx eas-cli build --profile development`。

## 项目结构

```
.
├── src/
│   ├── app/                     # Expo Router 路由目录（每个文件即一个页面）
│   │   ├── _layout.tsx          # 根布局，注册 Stack 导航
│   │   ├── index.tsx            # 入口页，根据登录状态重定向
│   │   ├── auth/
│   │   │   ├── login.tsx        # 登录页
│   │   │   └── register.tsx     # 注册页
│   │   └── home/
│   │       ├── home.tsx         # 首页新闻列表
│   │       └── homeDetail.tsx   # 新闻详情（WebView）
│   ├── components/              # 通用组件（主题文本/视图、图标等）
│   ├── constants/
│   │   └── theme.ts             # 颜色、字体、间距等主题常量
│   ├── hooks/                   # 自定义 Hook（色彩方案、主题）
│   ├── services/
│   │   └── httpClient.ts        # axios 实例 + 请求/响应拦截器
│   ├── store/
│   │   └── useAuthStore.ts      # Zustand 鉴权状态（含持久化）
│   ├── utils/
│   │   └── navigationHelper.ts  # 统一的导航封装
│   └── global.css
├── assets/                      # 图标、启动图等静态资源
├── app.json                     # Expo 应用配置
├── tsconfig.json                # TypeScript 配置（含 @/* 路径别名）
└── package.json
```

> 路径别名：`@/*` 映射到 `./src/*`，`@/assets/*` 映射到 `./assets/*`。

## 可用脚本

| 命令                    | 说明                    |
| ----------------------- | ----------------------- |
| `npm start`             | 启动 Expo 开发服务器    |
| `npm run ios`           | 构建并在 iOS 上运行     |
| `npm run android`       | 构建并在 Android 上运行 |
| `npm run web`           | 在 Web 端运行           |
| `npm run lint`          | 代码检查（ESLint）      |
| `npm run reset-project` | 重置项目为空白模板      |

## 架构说明

### 网络层（`src/services/httpClient.ts`）

统一封装 axios：

- **baseURL** 与超时时间集中配置；
- **请求拦截器**：自动从 `useAuthStore` 读取 token 并注入 `Authorization: Bearer <token>`；
- **响应拦截器**：直接返回 `response.data`；遇到 `401` 自动清空登录态并跳回登录页，`403`、`5xx` 给出相应提示。

### 鉴权状态（`src/store/useAuthStore.ts`）

基于 Zustand + `persist` 中间件，将 `token` 与 `userInfo` 持久化到 AsyncStorage（存储 Key 为 `auth-storage`），提供 `setLogin` / `updateUserInfo` / `logout` 方法。非组件环境（如拦截器）中可通过 `useAuthStore.getState()` 安全读取。

### 导航（`src/utils/navigationHelper.ts`）

对 `expo-router` 的 `router` 做了一层语义化封装（`nav.toHome` / `nav.toLogin` / `nav.push` / `nav.back`），统一跳转逻辑并支持参数传递。

## 后端接口

项目默认请求地址配置在 `src/services/httpClient.ts`：

```ts
baseURL: "http://192.168.68.55:5177/api";
```

主要接口：

| 方法   | 路径          | 说明                             |
| ------ | ------------- | -------------------------------- |
| `POST` | `/Auth/login` | 登录，返回 `token` 与 `userInfo` |
| `GET`  | `/News`       | 获取新闻列表（`articles` 字段）  |

> 请根据实际后端地址修改 `baseURL`，并确认数据字段与 `home.tsx` 中的映射逻辑一致。

## 构建与发布

使用 EAS 在云端构建、签名与发布，无需本地 Xcode / Android Studio：

```bash
# 构建
npx eas-cli build

# 提交到应用商店
npx eas-cli submit

# 推送 OTA 更新
npx eas-cli update
```

## 许可证

本项目基于 [MIT](./LICENSE) 许可证开源。
