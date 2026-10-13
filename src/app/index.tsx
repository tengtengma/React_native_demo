import { useAuthStore } from "@/store/useAuthStore";
import { Redirect } from "expo-router";

export default function Index() {
  // 目前先直接重定向到登录页
  // 后续这里会加上判断逻辑：if (token) 进首页 else 进登录页
  if (useAuthStore.getState().token) {
    return <Redirect href="/home/home" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}
