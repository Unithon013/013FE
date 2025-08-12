import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SoongsilKim, Video, OneLine, Chart, Circle } from "@/assets";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { colors, typography } from "@/constants";

type Profile = {
  id: string;
  name: string;
  age: number;
  district: string;
  photo: string; // 이미지 URL 또는 require()
};

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width; // FlatList 페이징 단위
const CARD_RADIUS = 27;

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

export default function MypageScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"video" | "summary">("video");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.primary }}
      edges={["top"]}
    >
      {/* 상단 오렌지 영역 (헤더 대체) */}
      <View style={styles.topHero}>
        <View style={styles.textWrapper}>
          <View style={styles.avatarCircle}>
            <SoongsilKim />
          </View>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.nameText}>김숭실</Text>
            </View>
            <Text style={styles.infoText}>75세 / 남자 / 미혼</Text>
            <View style={styles.tagsRow}>
              {["요리", "산책", "등산"].map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.circleRight}>
          <Circle />
        </View>
      </View>

      <View style={styles.stage}>
        {/* 상단 탭 (내 소개 영상 / AI 요약) */}
        <View style={styles.tabs}>
          <Pressable
            onPress={() => setTab("video")}
            style={[styles.tab, tab === "video" && styles.tabActive]}
          >
            <Text
              style={[styles.tabText, tab === "video" && styles.tabTextActive]}
            >
              내 소개 영상
            </Text>
            {tab === "video" && <View style={styles.tabIndicator} />}
          </Pressable>
          <Pressable
            onPress={() => setTab("summary")}
            style={[styles.tab, tab === "summary" && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                tab === "summary" && styles.tabTextActive,
              ]}
            >
              AI 요약
            </Text>
            {tab === "summary" && <View style={styles.tabIndicator} />}
          </Pressable>
        </View>
        {/* 콘텐츠 영역 */}
        {tab === "video" ? (
          <ScrollView>
            {typeof Video === "number" ||
            (Video && typeof Video === "object" && "uri" in (Video as any)) ? (
              <ImageBackground
                source={Video as any}
                style={styles.videoCard}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.videoCard}>
                <Video width="100%" height={379} />
              </View>
            )}
            <Pressable
              style={styles.primaryCta}
              onPress={() => console.log("다시 찍기")}
            >
              <Text style={styles.primaryCtaText}>다시 찍기</Text>
            </Pressable>
          </ScrollView>
        ) : (
          <ScrollView style={styles.summaryWrap}>
            {/* 한줄 소개 */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>한줄 소개</Text>
            </View>
            <ImageBackground
              source={require("@/assets/mypage/1line.png")}
              style={{
                width: "100%",
                height: 120,
                justifyContent: "center",
              }}
              resizeMode="cover"
            >
              <Text style={styles.oneLineText}>
                {"       "}노래, 등산 요리를 사랑하는
              </Text>
              <Text style={styles.oneLineText}>
                {"       "}인생을 즐기는 사람입니다.
              </Text>
            </ImageBackground>

            {/* AI 텍스트 */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle]}>내 프로필 수치</Text>
            </View>
            <View style={{ alignItems: "center", marginVertical: 5 }}>
              <Chart />
            </View>
            <Pressable
              style={styles.primaryCta}
              onPress={() => console.log("수정하기")}
            >
              <Text style={styles.primaryCtaText}>수정하기</Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    position: "relative",
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    height: 20,
    borderRadius: 30,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tagChipText: {
    ...typography.subB,
    color: colors.primary,
  },
  stage: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 6,
  },
  tabActive: {},
  tabText: {
    ...typography.h2,
    color: colors.textSub3,
    fontWeight: "600",
  },
  tabTextActive: {
    ...typography.h2,
    color: colors.textblack,
  },
  tabIndicator: {
    height: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    borderRadius: 3,
    alignSelf: "stretch",
  },
  videoCard: {
    width: "100%",
    height: 391,
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 28,
    marginLeft: 2,
    marginTop: -2,
    fontWeight: "700",
  },
  playButtonOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryCta: {
    marginTop: 16,
    height: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    alignSelf: "center",
    width: 320,
  },
  primaryCtaText: {
    color: colors.white,
    ...typography.h2,
  },

  summaryWrap: {
    marginHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: "800",
  },
  sectionEdit: {
    ...typography.h1,
    color: colors.primary,
  },
  oneLineText: {
    ...typography.title,
    color: colors.white,
  },
  cardBox: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.white,
    margin: 10,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  aiName: {
    ...typography.h2,
    color: colors.textblack,
    fontWeight: "800",
  },
  aiParagraph: {
    ...typography.body,
    color: colors.textblack,
    lineHeight: 26,
    marginBottom: 16,
  },
  secondaryCta: {
    alignSelf: "center",
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  secondaryCtaText: {
    color: colors.white,
    ...typography.h2,
  },
  circleRight: {
    position: "absolute",
    right: 20,
    top: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
