// app/(tabs)/home.tsx  혹은 HomeScreen.tsx
import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  FlatList,
  Dimensions,
  StyleSheet,
  ViewToken,
  FlatListProps,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import { HomeCharacter } from "@/assets";
import LockIcon from "@/assets/lock.svg";
import { colors, typography } from "../../../constants";

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width; //FlatList 페이징 단위
const CARD_RADIUS = 27;
const BASE_CARD_H = 520; //카드 기본 크기
const MIDDLE_VPAD = 30 + 8;

type Profile = {
  id: string;
  name: string;
  age: number;
  district: string;
  photo: string; // 이미지 URL 또는 require()
};

type Item = { kind: "profile"; profile: Profile } | { kind: "cta" }; //마지막 숨겨진 카드

const DATA: Profile[] = [
  {
    id: "1",
    name: "박막례",
    age: 60,
    district: "동작구",
    photo:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "김영희",
    age: 72,
    district: "성동구",
    photo:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "이순자",
    age: 70,
    district: "관악구",
    photo:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [profiles, setProfiles] = useState<Profile[]>(DATA); //프로필 리스트를 상태로
  const listRef = useRef<FlatList<Item>>(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const onViewRef = useRef<
    NonNullable<FlatListProps<Item>["onViewableItemsChanged"]>
  >(({ viewableItems }) => {
    const first = viewableItems[0];
    if (first?.index != null) setIndex(first.index);
  }).current;

  //모든 카드리스트의 마지막은 cta카드 있음
  const items: Item[] = useMemo(
    () => [
      ...profiles.map((p) => ({ kind: "profile", profile: p } as Item)),
      { kind: "cta" } as Item,
    ],
    [profiles]
  );

  const viewabilityConfig = useMemo(
    () => ({ viewAreaCoveragePercentThreshold: 60 }),
    []
  );

  //카드 크기 조절
  const [middleH, setMiddleH] = useState(0);
  const cardH = Math.max(
    280, //카드 크기 최소값
    Math.min(BASE_CARD_H, middleH - MIDDLE_VPAD)
  );

  const goPrev = () => {
    if (index <= 0) return;
    listRef.current?.scrollToIndex({ index: index - 1, animated: true });
  };

  const goNext = () =>
    index < items.length - 1 &&
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pendingScrollIndexRef = useRef<number | null>(null);

  // 추천받기 눌렀을 때 더 불러오는 예 + 나중에 실제 API로 교체해야함!!
  const fetchMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    const prevLen = profiles.length; //새 카드가 시작될 위치(= 이전 길이)

    //실제 API로 교체해야하는 부분
    const more: Profile[] = [
      {
        id: String(Date.now()),
        name: "박초롱",
        age: 26,
        district: "용산구",
        photo:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop",
      },
    ];

    if (more.length > 0) {
      setProfiles((prev) => [...prev, ...more]); // 새 카드들이 붙음
      pendingScrollIndexRef.current = prevLen; // 새 첫 카드로 이동
    }
    setIsLoadingMore(false);
  };

  const renderItem = ({ item }: { item: Item }) => {
    if (item.kind === "cta") {
      return (
        <View style={styles.page}>
          <View style={styles.cardShadow}>
            <View
              style={[styles.card, { height: cardH, backgroundColor: "#222" }]}
            >
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: "rgba(0,0,0,0.35)" },
                ]}
              />
              <View style={styles.lockCenter}>
                <Text style={styles.lockGuide}>
                  장작을 태워 더 많은 추천을 받아보세요.
                </Text>
                <LockIcon width={69} height={69} />
                <Pressable style={styles.recommendBtn} onPress={fetchMore}>
                  <Text style={styles.recommendText}>추천받기</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      );
    }

    const p = item.profile;
    return (
      <View style={styles.page}>
        <View style={styles.cardShadow}>
          <ImageBackground
            source={{ uri: p.photo }}
            style={[styles.card, { height: cardH }]}
            imageStyle={{ borderRadius: CARD_RADIUS }}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <View>
                <Text style={styles.nameLine1}>
                  {p.district}, {p.age}세
                </Text>
                <Text style={styles.nameLine2}>{p.name}</Text>
              </View>
              <Pressable
                style={styles.videoBtn}
                onPress={() =>
                  navigation.navigate("ReelsPage", {
                    imageUrl: p.photo,
                    district: p.district,
                    age: p.age,
                    name: p.name,
                  })
                }
              >
                <Text style={styles.videoBtnText}>클릭해서</Text>
                <Text style={styles.videoBtnText}>소개 영상 보기</Text>
              </Pressable>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.primary }}
      edges={["top"]}
    >
      {/* 상단 오렌지 영역 (헤더 대체) */}
      <View style={styles.topHero}>
        <View style={styles.textWrapper}>
          <View>
            <Text style={styles.heroLine1}>
              불씨 AI가 <Text style={{ fontWeight: "700" }}>김숭실님</Text>의
            </Text>
            <Text style={styles.heroLine2}>
              소개 영상을 분석해 친구를 찾고 있어요.
            </Text>
          </View>
          <HomeCharacter />
        </View>
      </View>

      <View style={styles.stage}>
        {/* 카드 스와이프 영역 */}
        <View
          style={styles.middle}
          onLayout={(e) => setMiddleH(e.nativeEvent.layout.height)}
        >
          <FlatList
            ref={listRef}
            data={items}
            keyExtractor={(it, i) =>
              it.kind === "profile" ? it.profile.id : `cta-${i}`
            }
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewRef}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={(_, i) => ({
              length: PAGE_WIDTH,
              offset: PAGE_WIDTH * i,
              index: i,
            })}
          />
        </View>

        {/* 하단 이전 / 다음 버튼 */}
        <View style={styles.footer}>
          <Pressable
            onPress={goPrev}
            disabled={index === 0}
            style={[styles.prevBtn, index === 0 && styles.disabled]}
          >
            <Text style={[styles.prevText, index === 0 && styles.disabledText]}>
              이전
            </Text>
          </Pressable>

          <Pressable
            onPress={goNext}
            disabled={index === items.length - 1}
            style={[
              styles.nextBtn,
              index === items.length - 1 && styles.disabled,
            ]}
          >
            <Text style={styles.nextText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHero: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLine1: {
    color: colors.white,
    ...typography.body,
    marginBottom: 2,
  },
  heroLine2: { color: colors.white, ...typography.body, fontWeight: "600" },
  page: {
    width: PAGE_WIDTH,
    paddingHorizontal: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  stage: {
    flex: 9,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
  },
  middle: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 8,
  },
  cardShadow: {
    borderRadius: CARD_RADIUS,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  card: {
    height: 520, // 필요에 맞게 조절
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomWrapper: {
    flexDirection: "row",
    gap: 30,
  },
  nameLine1: { color: colors.white, fontSize: 18, fontWeight: "700" },
  nameLine2: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
    marginBottom: 10,
  },
  videoBtn: {
    alignSelf: "flex-start",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  videoBtnText: { color: colors.white, ...typography.bodyB },
  footer: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  prevBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.textSub1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  prevText: { color: colors.textSub1, ...typography.h2 },

  nextBtn: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    color: colors.white,
    ...typography.h2,
  },
  disabled: { opacity: 0.4 },
  disabledText: { color: "#aaa" },

  lockCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  lockGuide: {
    color: "#fff",
    ...typography.bodyB,
    textAlign: "center",
    marginBottom: 18,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  recommendBtn: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  recommendText: {
    color: colors.white,
    ...typography.h3,
  },
});
