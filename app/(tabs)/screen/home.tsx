// app/(tabs)/home.tsx  혹은 HomeScreen.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  FlatList,
  Dimensions,
  StyleSheet,
  ViewToken,
  Modal,
  FlatListProps,
  Animated,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import LockIcon from "@/assets/lock.svg";
import FirewoodIcon from "@/assets/modal/firewood.svg";
import MinusBtnIcon from "@/assets/modal/minusBtn.svg";
import PlusBtnIcon from "@/assets/modal/plusBtn.svg";

import { StatusBar } from "expo-status-bar";
import { HomeCharacter } from "@/assets";

import { colors, typography } from "../../../constants";
import { API_BASE_URL } from "@env";
import * as VideoThumbnails from "expo-video-thumbnails";

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
  hobbies: string;
  location: string;
  photo: string; // 이미지 URL 또는 require()
};

// ===== Common helpers for parsing API shapes =====
const toAbs = (u: string | null | undefined) => {
  if (!u) return "";
  return u.startsWith("http") ? u : `${API_BASE_URL}${u}`;
};
const parseAge = (a: any) => {
  if (typeof a === "number") return a;
  if (typeof a === "string") {
    const m = a.match(/\d+/);
    return m ? parseInt(m[0], 10) : NaN;
  }
  return NaN;
};
const parseHobbies = (h: any): string => {
  if (Array.isArray(h)) return h.filter(Boolean).join(", ");
  if (typeof h === "string") {
    try {
      const arr = JSON.parse(h);
      if (Array.isArray(arr)) return arr.filter(Boolean).join(", ");
    } catch {}
    return h
      .split(/[\s,\n]+/)
      .map((s: string) => s.replace(/[\[\]"]+/g, "").trim())
      .filter(Boolean)
      .join(", ");
  }
  return "";
};
const extractArray = (body: any): any[] | null => {
  if (!body) return null;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.content)) return body.content;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.results)) return body.results;
  return null;
};
const normalizeProfile = async (it: any, idx: number): Promise<Profile> => {
  const id = String(it?.id ?? idx + 1);
  const name = it?.name ?? "";
  const age = parseAge(it?.age);
  const district = it?.location ?? it?.district ?? "";
  const locationStr = it?.location ?? it?.district ?? "";
  const hobbies = parseHobbies(it?.hobbies);
  const videoAbs = toAbs(it?.videoUrl ?? "");

  let photo = toAbs(it?.profileUrl || "");
  if (videoAbs) {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoAbs, {
        time: 1000,
      });
      // use video thumbnail if available
      if (uri) photo = uri;
    } catch (e) {
      console.log("[normalizeProfile] thumbnail error for", videoAbs, e);
    }
  }
  return {
    id,
    name,
    age: Number.isFinite(age) ? (age as number) : 0,
    district,
    hobbies,
    location: locationStr,
    photo,
  };
};

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation<any>();
  const [profiles, setProfiles] = useState<Profile[]>([]); // API 로딩 후 세팅
  const listRef = useRef<FlatList<Item>>(null);
  const insets = useSafeAreaInsets();
  const [meName, setMeName] = useState<string>("");
  const [meLat, setMeLat] = useState<number | null>(null);
  const [meLng, setMeLng] = useState<number | null>(null);
  const [meId, setMeId] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        // 위치가 필요한 API일 수 있으므로, 내 위치가 준비될 때까지 대기 (없어도 우선 시도)
        const base = `${API_BASE_URL}/recommendations`;
        const userId = meId || "1"; // fallback for testing
        const headers = {
          Accept: "application/json",
          "X-User-Id": userId,
        } as const;

        const tryFetch = async (url: string) => {
          console.log("[home recs] Fetching:", url);
          const res = await fetch(url, { method: "GET", headers });
          console.log("[home recs] Status:", res.status);
          if (
            res.headers &&
            typeof (res.headers as any).forEach === "function"
          ) {
            const headersObj: Record<string, string> = {};
            (res.headers as any).forEach(
              (v: string, k: string) => (headersObj[k] = v)
            );
            console.log("[home recs] Headers:", headersObj);
          }
          let body: any = null;
          const ctype = (res.headers as any)?.get
            ? (res.headers as any).get("content-type")
            : "";
          if (ctype && String(ctype).includes("application/json")) {
            try {
              body = await res.json();
            } catch {
              body = null;
            }
            console.log("[home recs] Body(JSON):", body);
          } else {
            const text = await res.text().catch(() => "");
            body = { _text: text };
            console.log("[home recs] Body(TEXT):", text);
          }
          // stop early if server returned an error payload
          if (body && typeof body === "object" && "error" in body) {
            console.log("[home recs] Server error:", body.error);
            return { res, body, list: null } as const;
          }
          return { res, body, list: extractArray(body) } as const;
        };

        // 시도 순서: 1) base  2) base?page/size  3) base?lat&lon  4) base?lat&lon&page/size
        const urls: string[] = [base];
        urls.push(`${base}?page=0&size=10`);
        if (meLat != null && meLng != null) {
          urls.push(`${base}?latitude=${meLat}&longitude=${meLng}`);
          urls.push(
            `${base}?latitude=${meLat}&longitude=${meLng}&page=0&size=10`
          );
        }

        let finalList: any[] | null = null;
        for (const u of urls) {
          const { res, body, list } = await tryFetch(u);
          if (res.ok && list && list.length) {
            finalList = list;
            break;
          }
          // 어떤 서버는 400이지만 본문에 data가 들어있을 수 있음
          if (list && list.length) {
            finalList = list;
            break;
          }
        }

        console.log(
          "[home recs] Parsed length:",
          finalList ? finalList.length : 0
        );
        if (!finalList || finalList.length === 0) return;

        const mapped = await Promise.all(
          finalList.map((it: any, idx: number) => normalizeProfile(it, idx))
        );

        if (!isCancelled) {
          const nonEmpty = mapped.filter((m) => !!m.name);
          if (nonEmpty.length) setProfiles(nonEmpty);
        }
      } catch (e) {
        console.log("[home recs] Fetch error:", e);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [API_BASE_URL, meLat, meLng]);

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
  //카드 이전
  const goPrev = () => {
    if (index <= 0) return;
    listRef.current?.scrollToIndex({ index: index - 1, animated: true });
  };
  //카드 다음
  const goNext = () =>
    index < items.length - 1 &&
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pendingScrollIndexRef = useRef<number | null>(null);

  // 추천받기 눌렀을 때 더 불러오는 예 + 실제 API로 교체함
  async function fetchMore(n: number) {
    try {
      const url = `${API_BASE_URL}/recommendations/additional`;
      console.log("[home recs additional] POST:", url, "count=", n);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-User-Id": "22", // TODO: 실제 인증으로 교체
        },
        body: JSON.stringify({ count: String(n) }), // 스펙상 문자열
      });

      console.log("[home recs additional] Status:", res.status);
      if (res.headers && typeof (res.headers as any).forEach === "function") {
        const headersObj: Record<string, string> = {};
        (res.headers as any).forEach(
          (v: string, k: string) => (headersObj[k] = v)
        );
        console.log("[home recs additional] Headers:", headersObj);
      }

      // 본문 파싱 (JSON / TEXT 모두 로깅)
      let body: any = null;
      const ctype =
        (res.headers as any)?.get?.call(res.headers, "content-type") || "";
      if (String(ctype).includes("application/json")) {
        try {
          body = await res.json();
        } catch {
          body = null;
        }
        console.log("[home recs additional] Body(JSON):", body);
      } else {
        const text = await res.text().catch(() => "");
        console.log("[home recs additional] Body(TEXT):", text);
        body = null;
      }

      if (body && typeof body === "object" && "error" in body) {
        console.log("[home recs additional] Server error:", body.error);
        return;
      }
      const list = extractArray(body);
      if (!list || list.length === 0) {
        console.log("[home recs additional] No list returned");
        return;
      }

      const more: Profile[] = await Promise.all(
        list.map((it: any, idx: number) => normalizeProfile(it, idx))
      );

      // 리스트 뒤에 붙이고 첫 새 카드로 스크롤
      const prevLen = profiles.length;
      setProfiles((prev) => [...prev, ...more]);
      pendingScrollIndexRef.current = prevLen;
    } catch (e) {
      console.log("[home recs additional] Fetch error:", e);
    }
  }

  //추천받기 눌렀을 때 모달
  const onPressCTA = () => openSheet();

  const confirmPicker = () => {
    setSheetStep("confirm");
  };

  const confirmPurchase = async () => {
    // 잔여/비용 체크 후 처리
    if (woodBalance < totalCost) {
      // 잔여 부족 처리(토스트 등)
      return;
    }
    setWoodBalance((b) => b - totalCost);
    closeSheet();
    await fetchMore(selectCount);
  };

  const renderItem = ({ item }: { item: Item }) => {
    if (item.kind === "cta") {
      return (
        <View style={styles.page}>
          <View style={styles.cardShadow}>
            <View
              style={[
                styles.card,
                { height: cardH, backgroundColor: "#636262ff" },
              ]}
            >
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: "rgba(0,0,0,0.2)" },
                ]}
              />
              <View style={styles.lockCenter}>
                <Text style={styles.lockGuide}>
                  장작을 태워 더 많은 추천을 받아보세요.
                </Text>
                <LockIcon width={69} height={69} />
                <Pressable style={styles.recommendBtn} onPress={onPressCTA}>
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
                  navigation.navigate("Reels", {
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

  //추천받기할 때 장작 소모 모달관련 부분
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetStep, setSheetStep] = useState<"picker" | "confirm">("picker");
  const [selectCount, setSelectCount] = useState(5);
  const backdropA = useRef(new Animated.Value(0)).current;
  const sheetA = useRef(new Animated.Value(0)).current;
  const sheetHRef = useRef(0);
  const [sheetReady, setSheetReady] = useState(false);

  // 비용/잔여
  const COST_PER_PERSON = 2; // 1명 추가당 장작 소모
  const [woodBalance, setWoodBalance] = useState(40); // 잔여 장작
  const totalCost = selectCount * COST_PER_PERSON;
  const MIN_CNT = 1; //추천 인원 수 최소값
  const MAX_CNT = 20; //추천 인원 수 최대값
  //모달 오픈...
  const openSheet = () => {
    setSelectCount(1);
    setSheetStep("picker");
    setSheetReady(false); //플리커 현상
    setSheetOpen(true);
  };

  useEffect(() => {
    if (!sheetOpen || !sheetReady) return;
    const h = sheetHRef.current || 500;
    backdropA.setValue(0);
    sheetA.setValue(h);
    Animated.parallel([
      Animated.timing(backdropA, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(sheetA, {
        toValue: 0,
        useNativeDriver: true,
        friction: 10,
        tension: 80,
      }),
    ]).start();
  }, [sheetOpen, sheetReady]);

  useEffect(() => {
    (async () => {
      try {
        const url = `${API_BASE_URL}/users/me`;
        console.log("[users/me] Fetching:", url);
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-User-Id": "22",
          },
        });
        console.log("[users/me] Status:", res.status);
        if (res.headers && typeof res.headers.forEach === "function") {
          const headersObj: Record<string, string> = {};
          res.headers.forEach((value, key) => {
            headersObj[key] = value;
          });
          console.log("[users/me] Headers:", headersObj);
        }
        const ctype =
          (res.headers?.get && res.headers.get("content-type")) || "";
        let data: any = {};
        if (ctype.includes("application/json")) {
          try {
            data = await res.json();
          } catch {
            data = {};
          }
          console.log("[users/me] JSON:", data);
        } else {
          const text = await res.text().catch(() => "");
          console.log("[users/me] TEXT:", text);
        }
        setMeName((data as any)?.name || "");
        if (typeof (data as any)?.latitude === "number")
          setMeLat((data as any).latitude);
        if (typeof (data as any)?.longitude === "number")
          setMeLng((data as any).longitude);
        setMeId(String((data as any)?.id || ""));
      } catch (e: any) {
        console.log("[users/me] Fetch error:", e?.name, e?.message);
      }
    })();
  }, []);

  const closeSheet = () => {
    const h = sheetHRef.current || 500;
    Animated.parallel([
      Animated.timing(backdropA, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(sheetA, {
        toValue: h,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setSheetOpen(false));
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
              불씨 AI가{" "}
              <Text style={{ fontWeight: "700" }}>
                {meName ? `${meName}님` : "회원님"}
              </Text>
              의
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

      {/* ===== 바텀시트 모달 ===== */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        presentationStyle="overFullScreen"
        onRequestClose={closeSheet}
      >
        <Animated.View style={[styles.backdrop, { opacity: backdropA }]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
        {/* 시트 */}
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: sheetA }],
              opacity: sheetReady ? 1 : 0,
            },
          ]}
          onLayout={(e) => {
            sheetHRef.current = e.nativeEvent.layout.height;
            setSheetReady(true); // 여기서부터 애니메이션 시작됨
          }}
        >
          <View style={styles.dragBar} />
          {/* Step 1: 수량 선택 */}
          {sheetStep === "picker" && (
            <View>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillText}>
                  소모될 장작{" "}
                  <Text style={{ color: colors.primary, fontWeight: "900" }}>
                    {totalCost}개
                  </Text>
                </Text>
              </View>

              <Text style={styles.qTitle}>몇 명을 추천받으실 건가요?</Text>

              <View style={styles.counterRow}>
                <Pressable
                  style={styles.circleBtn}
                  onPress={() =>
                    setSelectCount((c) => Math.max(MIN_CNT, c - 1))
                  }
                >
                  <MinusBtnIcon width={44} height={44} />
                </Pressable>

                <View style={styles.countWrap}>
                  <Text style={styles.countNum}>{selectCount}</Text>
                  <Text style={styles.countUnit}>명</Text>
                </View>

                <Pressable
                  style={styles.circleBtn}
                  onPress={() =>
                    setSelectCount((c) => Math.min(MAX_CNT, c + 1))
                  }
                >
                  <PlusBtnIcon width={44} height={44} />
                </Pressable>
              </View>

              <View style={styles.sheetBtns}>
                <Pressable style={styles.grayBtn} onPress={closeSheet}>
                  <Text style={styles.grayBtnTxt}>아니요</Text>
                </Pressable>
                <Pressable style={styles.orangeBtn} onPress={confirmPicker}>
                  <Text style={styles.orangeBtnTxt}>확인</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Step 2: 결제 확인 */}
          {sheetStep === "confirm" && (
            <View>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillText}>
                  장작 잔여 횟수{" "}
                  <Text style={{ color: colors.primary, fontWeight: "900" }}>
                    {woodBalance}개
                  </Text>
                </Text>
              </View>

              <View style={{ alignItems: "center", marginTop: 20 }}>
                <FirewoodIcon width={162} height={144} />
                <Text style={styles.confirmText}>
                  <Text style={{ color: colors.primary, fontWeight: "900" }}>
                    {totalCost}개
                  </Text>
                  의 장작을 사용하시겠습니까?
                </Text>
              </View>

              <View style={styles.sheetBtns}>
                <Pressable style={styles.grayBtn} onPress={closeSheet}>
                  <Text style={styles.grayBtnTxt}>아니요</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.orangeBtn,
                    woodBalance < totalCost && { opacity: 0.5 },
                  ]}
                  onPress={confirmPurchase}
                  disabled={woodBalance < totalCost}
                >
                  <Text style={styles.orangeBtnTxt}>확인</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      </Modal>
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
    flex: 7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 13,
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

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  dragBar: {
    alignSelf: "center",
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CFCFCF",
    marginBottom: 16,
  },
  infoPill: {
    alignSelf: "stretch",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  infoPillText: { ...typography.bodyB, color: "#676767" },
  qTitle: {
    marginTop: 28,
    marginBottom: 18,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
  },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    justifyContent: "center",
    gap: 28,
    marginBottom: 16,
  },
  circleBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  countWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    minWidth: 120,
    justifyContent: "center",
  },
  countNum: { color: colors.primary, ...typography.h0, fontSize: 50 },
  countUnit: { color: "#444", ...typography.h0, fontSize: 30, lineHeight: 32 },

  confirmText: { marginTop: 4, ...typography.h3, color: "#333" },

  sheetBtns: { flexDirection: "row", gap: 14, marginTop: 24 },
  grayBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#9EA0A3",
    alignItems: "center",
    justifyContent: "center",
  },
  grayBtnTxt: { fontSize: 18, fontWeight: "800", color: "#666" },
  orangeBtn: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  orangeBtnTxt: { fontSize: 18, fontWeight: "900", color: "#fff" },
});
