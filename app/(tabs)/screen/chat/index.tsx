import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";
import {
  SafeAreaView,
} from "react-native-safe-area-context";
import { colors, typography } from "@/constants";
import { useNavigation } from "@react-navigation/native";

// --- Dummy avatar requires (must be static for Metro bundler) ---
const AVATARS = [
  require("@/assets/chatdummy/jun.png"),
  require("@/assets/chatdummy/kim.png"),
  require("@/assets/chatdummy/lee.png"),
  require("@/assets/chatdummy/na.png"),
  require("@/assets/chatdummy/pack.png"),
];

// --- Types ---
interface ChatItem {
  id: string;
  name: string;
  age: number;
  tags: string[];
  lastMessage: string;
  avatar: any; // ImageSourcePropType but keep simple for RN types
}

// --- Small UI bits ---
const Chip = ({
  label,
  isPrimary = false,
}: {
  label: string;
  isPrimary?: boolean;
}) => (
  <View style={[styles.chip, isPrimary && styles.chipPrimary]}>
    <Text style={[styles.chipText, isPrimary && styles.chipTextPrimary]}>
      {label}
    </Text>
  </View>
);

// --- Helpers to fabricate more rows ---
const BASE_ROWS: Omit<ChatItem, "id">[] = [
  {
    name: "전원주",
    age: 75,
    tags: ["관악", "기독교", "절약"],
    lastMessage: "안녕하세요 장미꽃 같은 소녀여…",
    avatar: AVATARS[0],
  },
  {
    name: "김순례",
    age: 70,
    tags: ["관악", "송가인", "트로트"],
    lastMessage: "메세지를 입력하세요.",
    avatar: AVATARS[1],
  },
  {
    name: "이경숙",
    age: 69,
    tags: ["관악", "수다", "드라마"],
    lastMessage: "메세지를 입력하세요.",
    avatar: AVATARS[2],
  },
  {
    name: "나문희",
    age: 69,
    tags: ["관악", "여행", "강아지"],
    lastMessage: "메세지를 입력하세요.",
    avatar: AVATARS[3],
  },
  {
    name: "박막례",
    age: 69,
    tags: ["관악", "등산", "요리"],
    lastMessage: "메세지를 입력하세요.",
    avatar: AVATARS[4],
  },
];

const makeChunk = (page: number): ChatItem[] => {
  return BASE_ROWS.map((row, idx) => ({
    id: `${page}-${idx}`,
    ...row,
  }));
};

export default function ChatScreen() {
  const navigation = useNavigation();
  const [page, setPage] = useState(0);
  const [data, setData] = useState<ChatItem[]>(() => makeChunk(0));
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    // Simulate pagination
    const next = page + 1;
    const more = makeChunk(next);
    setTimeout(() => {
      setData((prev) => [...prev, ...more]);
      setPage(next);
      setLoading(false);
    }, 300);
  }, [loading, page]);

  const renderItem: ListRenderItem<ChatItem> = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.row}
          onPress={() => {
            if (index === 0) navigation.navigate("Chat0" as never);
          }}
        >
          <Image source={item.avatar} style={styles.avatar} />
          <View style={styles.rowBody}>
            <View style={styles.nameLine}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.age}>{item.age}세</Text>
            </View>
            <View style={styles.tagLine}>
              {item.tags.map((t, idx) => (
                <Chip
                  key={`${item.id}-${t}-${idx}`}
                  label={t}
                  isPrimary={idx === 0}
                />
              ))}
            </View>
            <Text style={styles.preview} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation]
  );

  const keyExtractor = useCallback((it: ChatItem) => it.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerWrap}>
        <View style={styles.headerBar} />
        <Text style={styles.headerTitle}>채팅목록</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      {ListHeader}
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: 24 },
  headerWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  headerBar: {
    width: 8,
    height: 28,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textblack,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  rowBody: { flex: 1 },
  nameLine: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    ...typography.h3,
    color: colors.textblack,
    marginRight: 8,
  },
  age: {
    ...typography.sub,
    color: colors.textSub2,
    marginRight: 8,
  },
  tagLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    color: colors.secondary,
  },
  chipTextPrimary: {
    color: colors.white,
  },
  preview: {
    ...typography.sub,
    color: colors.textSub2,
    marginTop: 6,
  },
  badge: {
    marginLeft: "auto",
    backgroundColor: colors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
  },
});
