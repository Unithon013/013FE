import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreHeader, Tree, StorePre } from "@/assets";
import { colors, typography } from "@/constants";

import { API_BASE_URL } from "@env";

const data = [
  { id: "1", count: 10, price: "5,000원" },
  { id: "2", count: 20, price: "9,000원" },
  { id: "3", count: 30, price: "13,000원" },
  { id: "4", count: 50, price: "21,000원" },
  { id: "5", count: 70, price: "29,000원" },
];

export default function StoreScreen() {
  const [meName, setMeName] = useState<string>("");
  const [mePoint, setMePoint] = useState<number>(0);
  const [meLoading, setMeLoading] = useState<boolean>(true);
  const [meError, setMeError] = useState<boolean>(false);

  useEffect(() => {
    const fetchMe = async () => {
      setMeLoading(true);
      setMeError(false);
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            "X-User-Id": "22",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setMeName(data?.name || "");
        setMePoint(data?.point ?? 0);
      } catch (e) {
        setMeError(true);
      } finally {
        setMeLoading(false);
      }
    };
    fetchMe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Tree />
      <Text style={styles.itemText}>장작 {item.count}개</Text>
      <TouchableOpacity style={styles.itemButton}>
        <Text style={styles.itemButtonText}>{item.price}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: 0 }]}>
      <View style={{ position: "relative" }}>
        <StoreHeader style={{ width: "100%", height: 140 }} />
        <View
          style={{
            position: "absolute",
            left: 140,
            bottom: 40,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.nameText}>{meName || "회원"}</Text>
          </View>
          <Text style={styles.infoText}>
            {meLoading
              ? "포인트 불러오는 중…"
              : meError
              ? "포인트를 불러오지 못했습니다"
              : `장작 ${mePoint.toLocaleString()}개`}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headerWrap}>
          <View style={styles.headerBar} />
          <Text style={styles.headerTitle}>멤버쉽</Text>
        </View>
        <View style={styles.storeWrap}>
          <StorePre />
        </View>
        
        <View style={styles.headerWrap}>
          <View style={styles.headerBar} />
          <Text style={styles.headerTitle}>개별 구매</Text>
        </View>
        {data.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <Tree />
            <Text style={styles.itemText}>장작 {item.count}개</Text>
            <TouchableOpacity style={styles.itemButton}>
              <Text style={styles.itemButtonText}>{item.price}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "flex-start",
  },
  headerWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  storeWrap:{
    alignItems: "center",
    justifyContent: "center",
  },
  headerBar: {
    width: 8,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textblack,
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    paddingHorizontal: 21,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  itemImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  itemText: {
    flex: 1,
    marginLeft: 12,
    ...typography.h3,
    color: colors.textblack,
  },
  itemButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  itemButtonText: {
    color: colors.white,
    ...typography.subB,
  },
  nameText: {
    ...typography.h1,
    color: colors.white,
    fontWeight: "700",
  },
  infoText: {
    ...typography.h3,
    color: colors.white,
    marginTop: 4,
  },
});
