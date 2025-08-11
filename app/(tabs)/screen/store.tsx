import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StoreHeader, Tree } from "@/assets";
import { colors, typography } from "@/constants";

const data = [
  { id: "1", count: 10, price: "5,000원" },
  { id: "2", count: 20, price: "9,000원" },
  { id: "3", count: 30, price: "13,000원" },
  { id: "4", count: 50, price: "21,000원" },
  { id: "5", count: 70, price: "29,000원" },
];

export default function StoreScreen() {
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
      <View style={styles.headerWrap}>
        <StoreHeader style={{ width: "100%", height: 140 }} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  headerWrap: {
    marginTop: 0,
    marginBottom: 16,
    alignSelf: "stretch",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
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
});
