import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
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
import * as VideoThumbnails from "expo-video-thumbnails";
import { Video as ExpoVideo, ResizeMode } from "expo-av";

import { API_BASE_URL } from "@env";

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

  const [meName, setMeName] = useState("");
  const [meAge, setMeAge] = useState("");
  const [meGender, setMeGender] = useState("");
  const [meHobbies, setMeHobbies] = useState<string[]>([]);
  const [meLocation, setMeLocation] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [meProfileUrl, setMeProfileUrl] = useState<string>("");
  const [avatarUri, setAvatarUri] = useState<string>("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const url = `${API_BASE_URL}/users/me`;
        console.log("[mypage users/me] Fetching:", url);
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            // TODO: replace this test header with real auth header when ready
            "X-User-Id": "22",
          },
        });
        console.log("[mypage users/me] Status:", res.status);
        const ctype =
          (res.headers?.get && res.headers.get("content-type")) || "";
        let data: any = {};
        if (ctype.includes("application/json")) {
          try {
            data = await res.json();
          } catch {
            data = {};
          }
          console.log("[mypage users/me] JSON:", data);
        } else {
          const text = await res.text().catch(() => "");
          console.log("[mypage users/me] TEXT:", text);
        }

        // name
        setMeName(data?.name ?? "");
        setMeLocation(
          (data?.location as string) || (data?.district as string) || ""
        );

        // age: allow "83세" or number
        let ageNum = "";
        if (typeof data?.age === "number") {
          ageNum = String(data.age);
        } else if (typeof data?.age === "string") {
          const m = data.age.match(/\d+/);
          ageNum = m ? m[0] : "";
        }
        setMeAge(ageNum);

        // gender: map to '남성' or '여성' if available
        let genderStr = "";
        const genderRaw = data?.gender;
        if (typeof genderRaw === "string") {
          const g = genderRaw.toLowerCase();
          if (g === "m" || g === "male") {
            genderStr = "남성";
          } else if (g === "f" || g === "female") {
            genderStr = "여성";
          }
        }
        setMeGender(genderStr);

        // hobbies: can be array or a JSON-stringified array
        let hobbiesArr: string[] = [];
        if (Array.isArray(data?.hobbies)) {
          hobbiesArr = data.hobbies.filter(Boolean);
        } else if (typeof data?.hobbies === "string") {
          try {
            const parsed = JSON.parse(data.hobbies);
            if (Array.isArray(parsed)) hobbiesArr = parsed.filter(Boolean);
          } catch {
            hobbiesArr = data.hobbies
              .split(/[\s,\n]+/)
              .map((s: string) => s.replace(/[\[\]"]+/g, "").trim())
              .filter(Boolean);
          }
        }
        setMeHobbies(hobbiesArr);

        // profileUrl: absolute (fallback image)
        const rawProfile = data?.profileUrl ?? "";
        const absoluteProfile = rawProfile
          ? rawProfile.startsWith("http")
            ? rawProfile
            : `${API_BASE_URL}${rawProfile}`
          : "";
        setMeProfileUrl(absoluteProfile);

        // videoUrl: may be relative like "/media/..."
        const rawVideo = data?.videoUrl ?? "";
        const absoluteVideo = rawVideo
          ? rawVideo.startsWith("http")
            ? rawVideo
            : `${API_BASE_URL}${rawVideo}`
          : "";
        setVideoUrl(absoluteVideo);

        // avatar thumbnail: prefer video thumbnail, fallback to profileUrl
        try {
          if (absoluteVideo) {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
              absoluteVideo,
              { time: 1000 }
            );
            if (uri) setAvatarUri(uri);
          }
        } catch (err) {
          console.log("[mypage] thumbnail error:", err);
        } finally {
          if (!avatarUri && absoluteProfile) setAvatarUri(absoluteProfile);
        }
      } catch (e) {
        console.log("[mypage users/me] Fetch error:", e);
      }
    };
    fetchMe();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.primary }}
      edges={["top"]}
    >
      {/* 상단 오렌지 영역 (헤더 대체) */}
      <View style={styles.topHero}>
        <View style={styles.textWrapper}>
          <View style={styles.avatarCircle}>
            {avatarUri ? (
              <ImageBackground
                source={{ uri: avatarUri }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <SoongsilKim />
            )}
          </View>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.nameText}>{meName || "회원"}</Text>
            </View>
            <Text style={styles.infoText}>
              {meAge ? `${meAge}세` : ""}
              {meGender ? ` / ${meGender}` : " / 혼성"}
            </Text>
            <View style={styles.tagsRow}>
              {meLocation ? (
                <View key="__loc" style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{meLocation}</Text>
                </View>
              ) : null}
              {meHobbies.map((tag) => (
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
            {videoUrl ? (
              <ExpoVideo
                source={{ uri: videoUrl }}
                style={styles.videoCard}
                resizeMode={ResizeMode.COVER}
                useNativeControls
                shouldPlay={false}
                isLooping={false}
              />
            ) : typeof Video === "number" ||
              (Video &&
                typeof Video === "object" &&
                "uri" in (Video as any)) ? (
              <ImageBackground
                source={Video as any}
                style={styles.videoCard}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.videoCard}>
                <Video />
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
                {"       "}
                {meHobbies.length > 0
                  ? `${meHobbies.join(", ")}를 사랑하는`
                  : ""}
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
    flex: 9,
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
    marginHorizontal: 20,
    width: "90%",
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
