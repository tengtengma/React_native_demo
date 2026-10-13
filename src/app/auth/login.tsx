import { httpClient } from "@/services/httpClient";
import { useAuthStore } from "@/store/useAuthStore";
import { nav } from "@/utils/navigationHelper";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // 获取 Zustand 的登录方法
  const setLogin = useAuthStore((state) => state.setLogin);

  const handleLogin = async () => {
    // 简单的非空校验
    if (!username.trim() || !password.trim()) {
      Alert.alert("提示", "请输入用户名和密码");
      return;
    }

    setLoading(true);

    try {
      const response: any = await httpClient.post("/Auth/login", {
        username,
        password,
      });

      if (response.data.token) {
        setLogin(response.data.token, response.data.userInfo);
        nav.toHome();
      } else {
        Alert.alert("登录失败", "用户名或密码错误");
      }
    } catch (error) {
      console.error("登录失败:", error);
      Alert.alert("登录失败", "请检查用户名和密码是否正确");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    // 跳转到注册页面
    nav.push("/auth/register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>欢迎登录</Text>

      <TextInput
        style={styles.input}
        placeholder="请输入用户名"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="请输入密码"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>登录</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>注册</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
});
