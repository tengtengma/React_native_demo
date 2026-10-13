import { nav } from "@/utils/navigationHelper";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function NewsDetailScreen() {
  const { id, url, title } = useLocalSearchParams<{
    id: string;
    url: string;
    title: string;
  }>();

  console.log("当前查看的新闻 ID:", id);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 顶部导航栏：左侧返回箭头，中间标题 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => nav.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          新闻详情
        </Text>

        {/* 右侧放一个空 View 用于平衡布局，确保标题绝对居中 */}
        <View style={styles.rightPlaceholder} />
      </View>

      <WebView
        source={{ uri: url || "https://google.com" }}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backIcon: {
    fontSize: 32,
    color: "#007AFF",
    fontWeight: "300",
    marginTop: -2, // 微调符号的垂直居中位置
  },
  title: {
    flex: 1, // 让标题占满中间剩余空间
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // 文字居中
    color: "#333",
  },
  rightPlaceholder: {
    width: 40, // 宽度与左侧返回按钮保持一致，确保标题视觉上绝对居中
  },
  webview: {
    flex: 1,
  },
});
