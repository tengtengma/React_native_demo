import { httpClient } from "@/services/httpClient";
import { nav } from "@/utils/navigationHelper";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 确保安全区域

interface HomeNews {
  id: string;
  author: string;
  title: string;
  summary: string;
  source: string;
  imageURL: string | null;
  category: string;
  language: string;
  country: string;
  publishedAt: string;
  url: string;
}

export default function HomeScreen() {
  const [data, setData] = useState<HomeNews[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    try {
      httpClient.get("/News").then((response: any) => {
        const rawList = response.data.articles || [];
        const formattedList: HomeNews[] = rawList.map((item: any) => {
          const url = item.url || "";
          return {
            id: url ? url : Math.random().toString(),
            author: item.author || "",
            title: item.title || "Untitled",
            summary: item.description || item.summary || "",
            source: item.source || "Unknown source",
            imageURL: item.image || item.imageURL || null,
            category: item.category || "general",
            language: item.language || "",
            country: item.country || "",
            publishedAt: item.published_at || item.publishedAt || "",
            url: url,
          };
        });

        setData(formattedList);
      });
    } catch (error) {
      console.error("获取首页新闻失败:", error);
    } finally {
      console.log("获取首页新闻完成");
    }
  }

  return (
    // 使用 SafeAreaView 自动避开刘海屏和底部黑条
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>首页</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          /* 用 TouchableOpacity 包裹使其可点击 */
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              // 跳转到详情页，并通过路由参数把 url 或 title 传过去
              nav.push("/home/homeDetail", {
                id: item.id,
                url: item.url,
                title: item.title,
              });
            }}
          >
            {item.imageURL ? (
              <Image source={{ uri: item.imageURL }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnail, styles.placeholder]} />
            )}

            <View style={styles.textContainer}>
              <Text style={styles.itemText} numberOfLines={2}>
                {item.title}
              </Text>
              {item.summary ? (
                <Text style={styles.summaryText} numberOfLines={2}>
                  {item.summary}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 16,
    textAlign: "center",
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  item: {
    flexDirection: "row", // 关键：横向排列（左图右文）
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1, // 让右侧文字自动占满剩余的宽度
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 13,
    color: "#666",
  },
});
