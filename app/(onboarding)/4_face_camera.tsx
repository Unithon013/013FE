import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, Animated } from "react-native";
import { CameraView, useCameraPermissions, useMicrophonePermissions} from "expo-camera";
import { useRouter } from "expo-router";
import { colors, typography } from "@/constants";
import LottieView from 'lottie-react-native';

type Phase = "align" | "prep" | "recording" | "uploading";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

export default function IntroRecordScreen() {
  const camRef = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [camPerm, requestCamPerm] = useCameraPermissions();
  const [micPerm, requestMicPerm] = useMicrophonePermissions();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("align");
  const [count3, setCount3] = useState(3);
  const [leftSec, setLeftSec] = useState(30);
  const startedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const introOpacity = useRef(new Animated.Value(0.6)).current; //반투명 오버레이 애니메이션
  const [introGone, setIntroGone] = useState(false);

  // prep 진입 시 3초 카운트 시작
  useEffect(() => {
    if (phase !== "prep") return;
    setCount3(3);
    const itv = setInterval(() => {
      setCount3((v) => {
        if (v <= 1) {
          clearInterval(itv);
          setPhase("recording");
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(itv);
  }, [phase]);

  // recording 진입 시 실제 녹화 시작 + 30초 카운트다운
  useEffect(() => {
    if (phase !== "recording" || !ready || startedRef.current) return;
    startedRef.current = true;

    setLeftSec(30);
    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const left = Math.max(0, 30 - elapsed);
      setLeftSec(left);
      
      // 30초가 끝나면 녹화 종료
      if (left === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleRecordingComplete();
      }
    }, 250);
    startRecording();
  }, [phase, ready]);

  //반투명 검정 오버레이 천천히 사라지는 애니메이션
  useEffect(() => {
    if (phase === "align") {
        introOpacity.setValue(0.95);
        setIntroGone(false);
        Animated.timing(introOpacity, {
        toValue: 0,
        duration: 3000, 
        useNativeDriver: true,
        }).start(() => setIntroGone(true)); 
    }
  }, [phase]);

  async function ensurePerms() {
    if (!camPerm?.granted) await requestCamPerm();
    if (!micPerm?.granted) await requestMicPerm();
    return camPerm?.granted && micPerm?.granted;
  }

  async function startRecording() {
    const ok = await ensurePerms();
    if (!ok) {
        console.warn("권한 허용 필요");
        return (
        <View style={styles.center}>
            <Text style={{ color: "#fff" }}>카메라/마이크 권한을 허용해주세요.</Text>
        </View>
        );
    }
    try {
      const result = await camRef.current?.recordAsync({ maxDuration: 30 });
      if (result?.uri) {
        setPhase("uploading");
        // await uploadVideo(result.uri); // 나중에 구현
        router.replace("/(onboarding)/5_profile_done");
      }
    } catch (e) {
      if (timerRef.current) clearInterval(timerRef.current);
      console.warn("record error:", e);
      router.back();
    }
  }

  function handleRecordingComplete() {
    // 녹화 완료 처리
    camRef.current?.stopRecording();
  }

  function handleFaceRecognized() {
    if (phase !== "align") return;
    setPhase("prep");
  }


  return (
    <View style={styles.container}>
      <CameraView
        ref={camRef}
        style={StyleSheet.absoluteFillObject}
        facing="front"
        mode="video"
        onCameraReady={() => setReady(true)}
      />

    {phase === "align" && (
    <>
        {/* 검정 반투명 오버레이 (2초 후 페이드아웃) */}
        {!introGone && (
        <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill,
      { backgroundColor: "black", opacity: introOpacity },]}
        />
        )}
        <View style={styles.overlayFull} pointerEvents="none">
            <Image
                source={require("@/assets/faceGuide.png")}
                style={styles.guideImg}
                resizeMode="contain"
            />
        </View>
        <View style={styles.topTextWrap} pointerEvents="none">
            <Text style={styles.titleWhite1}>
                화면에 맞춰{"\n"}얼굴을 보여주세요
            </Text>
        </View>
        <View style={styles.bottomWrap}>
          <Pressable style={styles.cta} onPress={handleFaceRecognized}>
            <Text style={styles.ctaText}>촬영 시작하기</Text>
          </Pressable>
        </View>
    </>
    )}

      {phase === "prep" && (
        <>
          <View pointerEvents="none" style={[styles.dim, { opacity: 0.6 }]} />
          <View pointerEvents="none" style={styles.overlayFull}>
            <View style={[styles.topTitleWrap, { top: 120 }]}>
              <Text style={styles.titleOrange}>30초 자기소개</Text>
              <Text style={styles.titleWhite}>자신의 매력을 뽐내주세요!</Text>
            </View>
          </View>
          <View pointerEvents="none" style={styles.center}>
            <View style={styles.countCircle}>
              <Text style={styles.countText}>{count3}</Text>
            </View>
          </View>
        </>
      )}

      {phase === "recording" && (
        <>
          <View pointerEvents="none" style={styles.topRight}>
            <View style={styles.timerPill}>
              <View style={styles.clockDot} />
              <Text style={styles.timerText}>{leftSec}초</Text>
            </View>
          </View>

          <View pointerEvents="none" style={styles.bottomHelpWrap}>
            <View style={[styles.bottomHelpCard,{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
              <Text style={styles.bottomHelpOrange}>이름 나이 취미는{" "}</Text>
              <Text style={styles.bottomHelpWhite}>필수 항목이에요!</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.textblack },
  center: { 
    flex: 1,
    alignItems: "center", 
    justifyContent: "center",
  },
  overlayFull: { 
    ...StyleSheet.absoluteFillObject, 
    width: "100%", 
    height: "100%",
    justifyContent: 'center',  
    alignItems: 'center',
  },
  guideImg: {
    width: "95%",
  },
  dim: { 
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black", 
  },
  topTextWrap: {
    position: "absolute",
    top: 140,
    left: 0, right: 0,
    alignItems: "center",
  },
  titleWhite1: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 38,
    fontWeight: "800",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  
  bigWhiteCenter: {
    color: "#fff", 
    fontSize: 24, 
    textAlign: "center", 
    fontWeight: "bold",
    textShadowColor: colors.textblack, 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 6,
  },
  bottomWrap: { position: "absolute", 
    left: 0, right: 0, 
    bottom: 50, 
    alignItems: "center" },
  cta: {
    minWidth: "72%", paddingVertical: 16, paddingHorizontal: 22,
    borderRadius: 22, backgroundColor: colors.primary, alignItems: "center",
  },
  ctaText: { color:colors.white, ...typography.h2 },
  topTitleWrap: { 
    width: "100%", 
    alignItems: "center",
    marginTop: 30,
  },
  titleOrange: { 
    color: colors.primary, 
    fontSize: 28, 
    fontWeight: "800", 
    marginBottom: 12 
  },
  titleWhite: {
    color: "#fff", 
    fontSize: 26, 
    fontWeight: "700",
    textShadowColor: colors.textblack, 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 6,
  },
  countCircle: {
    width: 160, 
    height: 160, 
    borderRadius: 80,
    borderWidth: 8, 
    borderColor: colors.primary,
    alignItems: "center", 
    justifyContent: "center",
  },
  countText: { 
    color: colors.primary, 
    fontSize: 80, 
    fontWeight: "900" 
  },

  topRight: { 
    position: "absolute", 
    top: 28, 
    right: 20 
  },
  timerPill: {
    flexDirection: "row", 
    alignItems: "center",
    paddingHorizontal: 12, 
    paddingVertical: 8,
    borderRadius: 18, 
    backgroundColor: colors.textblack,
  },
  clockDot: {
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    borderWidth: 3, 
    borderColor: colors.primary,
    marginRight: 8,
  },
  timerText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "700" 
  },

  bottomHelpWrap: { 
    position: "absolute", 
    bottom: 0,
    width: "100%",
    alignItems: "center" 
  },
  bottomHelpCard: {
    backgroundColor: colors.textblack, 
    alignItems: "center",
    borderRadius: 18,
    width: "100%", 
    paddingHorizontal: 20, 
    paddingVertical: 30,
  },
  bottomHelpOrange: { 
    color: colors.primary,
    ...typography.h2,
  },
  bottomHelpWhite: { 
    color: "#fff", 
    ...typography.h2,
  },
});