import { router } from "expo-router";

export const nav = {
  // 登录后跳转首页
  toHome: () => router.replace("/home/home"),

  // 去登录页
  toLogin: () => router.replace("/auth/login"),

  // 通用返回
  back: () => router.back(),

  // 通用跳转（支持传路径和参数对象）
  push: (path: string, params?: Record<string, any>) => {
    if (params) {
      router.push({
        pathname: path as any,
        params: params,
      });
    } else {
      router.push(path as any);
    }
  },
};
