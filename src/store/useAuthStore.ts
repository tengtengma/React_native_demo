import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 定义用户信息的数据结构（根据你的实际后端返回字段调整）
export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

// 定义 AuthStore 的状态和方法类型
interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;

  // 动作方法
  setLogin: (token: string, userInfo: UserInfo) => void;
  updateUserInfo: (userInfo: Partial<UserInfo>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,

      // 登录成功：写入 Token 和用户信息
      setLogin: (token, userInfo) => {
        set({ token, userInfo });
      },

      // 局部更新用户信息（例如修改昵称、头像后调用）
      updateUserInfo: (partialUser) => {
        set((state) => ({
          userInfo: state.userInfo
            ? { ...state.userInfo, ...partialUser }
            : null,
        }));
      },

      // 登出：清空所有认证状态
      logout: () => {
        set({ token: null, userInfo: null });
      },
    }),
    {
      name: "auth-storage", // 本地 AsyncStorage 中存储的 Key
      storage: createJSONStorage(() => AsyncStorage), // 使用 React Native 的 AsyncStorage 进行持久化
    },
  ),
);
