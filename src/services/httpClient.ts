import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { router } from "expo-router";

// 1. 创建 axios 实例
export const httpClient = axios.create({
  baseURL: "http://192.168.68.55:5177/api",
  timeout: 10000, // 请求超时时间（10秒）
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// 2. 请求拦截器 (Request Interceptor)
// =======================
httpClient.interceptors.request.use(
  (config) => {
    // 从 Zustand 的持久化状态中直接拿 token（非 React 组件内也能安全读取）
    const token = useAuthStore.getState().token;

    if (token) {
      // 自动给每个请求带上 Authorization 头
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// =======================
// 3. 响应拦截器 (Response Interceptor)
// =======================
httpClient.interceptors.response.use(
  (response) => {
    // 假设后端标准返回结构是 { code: 200, data: ..., message: "..." }
    // 这里可以直接把核心数据剥离出来，组件里用起来更爽
    return response.data;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // 401 说明 Token 失效或过期
      console.warn("登录状态已过期，请重新登录");

      // 1. 清空 Zustand 里的用户状态
      useAuthStore.getState().logout();

      // 2. 强行踢回登录页
      router.replace("/auth/login");
    } else if (status === 403) {
      console.warn("没有权限访问该资源");
    } else if (status >= 500) {
      console.warn("服务器开小差了，请稍后再试");
    }

    return Promise.reject(error);
  },
);
