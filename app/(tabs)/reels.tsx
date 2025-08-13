import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StyleSheet,
  Animated,
  Modal,
  LogBox,
} from "react-native";

import FirewoodIcon from "@/assets/modal/firewood.svg";
import { colors, typography } from "@/constants";
import { Back } from "@/assets";
import { Video as ExpoVideo, ResizeMode } from "expo-av";

export default function Reels() {
  const route = useRoute();
  const {
    imageUrl = "",
    district = "",
    age = "",
    name = "",
  } = (route as any).params || {};
  const navigation = useNavigation<any>();
  const rawVideo = (route as any).params?.videoUrl ?? "";
  const videoUrl = rawVideo.startsWith("http")
    ? rawVideo
    : `${API_BASE_URL}${rawVideo}`;

  useEffect(() => {
    console.log("[Reels][Video] Resolved videoUrl:", videoUrl);
    if (!videoUrl) return;
    (async () => {
      try {
        const head = await fetch(videoUrl, { method: "HEAD" });
        const ctype = head.headers?.get?.("content-type");
        console.log(
          "[Reels][Video] HEAD status:",
          head.status,
          "ctype:",
          ctype
        );
      } catch (err) {
        console.log("[Reels][Video] HEAD error:", err);
      }
    })();
  }, [videoUrl]);

  //연락하기 버튼 누른 후 장작 결제 모달
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetStep, setSheetStep] = useState<"picker" | "confirm">("picker");
  const [selectCount, setSelectCount] = useState(5);
  const backdropA = useRef(new Animated.Value(0)).current;
  const sheetA = useRef(new Animated.Value(0)).current;
  const sheetHRef = useRef(0);
  const [sheetReady, setSheetReady] = useState(false);

  const COST_FOR_CHAT = 10; // 1명 연락당 장작 소모
  const [woodBalance, setWoodBalance] = useState(40); // 잔여 장작

  useEffect(() => {
    // Hide expo-av deprecation warning (we intentionally use expo-av)
    LogBox.ignoreLogs([
      "[expo-av]: Video component from `expo-av` is deprecated in favor of `expo-video`.",
      "[expo-av]: Video component from `expo-av` is deprecated in favor of `expo-video`",
      "Video component from `expo-av` is deprecated in favor of `expo-video`",
    ]);
  }, []);

  const confirmPurchase = async () => {
    // 잔여/비용 체크 후 처리
    if (woodBalance < COST_FOR_CHAT) {
      // 잔여 부족 처리(토스트 등)
      return;
    }
    setWoodBalance((b) => b - COST_FOR_CHAT);
    closeSheet();
    navigation.navigate("Chat0");
  };

  //연락하기 눌렀을 때 모달
  const onPressCTA = () => openSheet();
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

  // Upload test video function
  const uploadTestVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
      });
      console.log("Picked file:", result);
      if (result.canceled) return;
      const formData = new FormData();
      formData.append("video", {
        uri: result.assets[0].uri,
        name: result.assets[0].name || "test.mp4",
        type: result.assets[0].mimeType || "video/mp4",
      } as any);
      formData.append("latitude", "37.5665");
      formData.append("longitude", "126.9780");
      console.log("Uploading to:", `${API_BASE_URL}/users/onboarding`);
      const res = await fetch(`${API_BASE_URL}/users/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        body: formData,
      });
      console.log("Response status:", res.status);
      // Log headers as object for readability
      if (res.headers && typeof res.headers.forEach === "function") {
        const headersObj: Record<string, string> = {};
        res.headers.forEach((value, key) => {
          headersObj[key] = value;
        });
        console.log("Response headers:", headersObj);
      }
      const data = await res.json();
      console.log("Returned task_id:", data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const getUserMeTest = async () => {
    try {
      const url = `${API_BASE_URL}/users/me`;
      console.log("Fetching user me:", url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      console.log("UserMe Response status:", res.status);
      const data = await res.json();
      console.log("UserMe JSON body:", data);
    } catch (err) {
      console.error("UserMe fetch error:", err);
    }
  };

  const firstStatusRef = useRef<boolean>(true);
  const lastStatusRef = useRef<any>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <View style={{ flex: 1 }}>
        <ExpoVideo
          source={{ uri: videoUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false}
          onLoadStart={() => {
            console.log("[Reels][Video] onLoadStart");
          }}
          onLoad={(payload) => {
            try {
              const { durationMillis, naturalSize } = payload as any;
              console.log("[Reels][Video] onLoad:", {
                durationMillis,
                naturalSize,
              });
            } catch {
              console.log("[Reels][Video] onLoad (raw):", payload);
            }
          }}
          onError={(e) => {
            console.log("[Reels][Video] onError:", JSON.stringify(e, null, 2));
          }}
          onReadyForDisplay={(info) => {
            console.log("[Reels][Video] onReadyForDisplay:", info);
          }}
          onPlaybackStatusUpdate={(status) => {
            // Log the first status and when status meaningfully changes
            try {
              if (firstStatusRef.current) {
                firstStatusRef.current = false;
                console.log("[Reels][Video] status(init):", status);
              } else {
                const prev = lastStatusRef.current || {};
                if (
                  prev.isLoaded !== (status as any).isLoaded ||
                  prev.isPlaying !== (status as any).isPlaying ||
                  prev.shouldPlay !== (status as any).shouldPlay ||
                  prev.positionMillis !== (status as any).positionMillis ||
                  prev.error !== (status as any).error
                ) {
                  console.log("[Reels][Video] status(update):", status);
                }
              }
              lastStatusRef.current = status;
            } catch {
              console.log("[Reels][Video] status(raw):", status);
            }
          }}
          onFullscreenUpdate={(evt) => {
            console.log("[Reels][Video] onFullscreenUpdate:", evt);
          }}
        />
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Back />
          <Text style={styles.backText}> 이전 </Text>
        </Pressable>
        <View style={styles.overlay}>
          <View style={{ justifyContent: "flex-start", flex: 1 }}>
            <Text style={styles.nameLine1}>
              {district}, {age}세
            </Text>
            <Text style={styles.nameLine2}>{name}</Text>
          </View>
          <Pressable style={styles.videoBtn} onPress={onPressCTA}>
            <Text style={styles.videoBtnText}>연락하기</Text>
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
                  {COST_FOR_CHAT}개
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
                  woodBalance < COST_FOR_CHAT && { opacity: 0.5 },
                ]}
                onPress={confirmPurchase}
                disabled={woodBalance < COST_FOR_CHAT}
              >
                <Text style={styles.orangeBtnTxt}>확인</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 160,
  },
  nameLine1: {
    marginTop: 5,
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  nameLine2: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
    marginBottom: 10,
  },
  videoBtn: {
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  videoBtnText: { color: colors.white, ...typography.h3 },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: { ...typography.h3, color: colors.white },

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
