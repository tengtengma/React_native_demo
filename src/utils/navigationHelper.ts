import { router } from "expo-router";

export const nav = {
  // 登录后跳转首页
  toHome: () => router.replace("/home/home"),

  // 去登录页
  toLogin: () => router.replace("/auth/login"),

  // 去详情页（带参数）
  toDetail: (id: string) => router.push(`/home/homeDetail?id=${id}`),

  // 通用返回
  back: () => router.back(),

  // 通用跳转
  push: (path: string) => router.push(path as any),
};
