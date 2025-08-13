import React from 'react';
import { View, Text, Pressable, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { colors, typography } from "@/constants";
import { Ai1 } from "@/assets";
import { useEffect, useRef } from "react";

useEffect(() => {
  console.log('[Splash] mount');
}, []);

export default function Splash() {
  const router = useRouter();
  const bobY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
      const timer = setTimeout(() => {
        router.push("/(onboarding)/2_splash2");
      }, 2000); // 2초 후 이동
  
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobY, {
          toValue: -5,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bobY, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
      bobY.stopAnimation();
    };
  }, [bobY]);

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => router.push("/(onboarding)/2_splash2")}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.white,
        }}
      >
        <View
          style={{
            zIndex: 1,
            alignItems: "center",
            position: "absolute",
            top: "27%",
          }}
        >
          <Text
            style={[
              typography.h1,
              {
                color: colors.primary,
                marginVertical: 3,
                textShadowColor: "rgba(0, 0, 0, 0.2)",
                textShadowOffset: { width: 1, height: 1 }, // 그림자 위치
                textShadowRadius: 4, // 그림자 퍼짐 정도
              },
            ]}
          >
            불씨AI 매니저가,
          </Text>
          <Text
            style={[
              typography.h2,
              { color: colors.textblack, marginVertical: 3 },
            ]}
          >
            30초 자기소개를 바탕으로
          </Text>
          <Text
            style={[
              typography.h2,
              { color: colors.textblack, marginVertical: 3 },
            ]}
          >
            친구를 추천해드려요!
          </Text>
        </View>
        <Animated.View
          style={{
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
            zIndex: 1,
            transform: [{ translateY: bobY }],
          }}
        >
          <Ai1 />
        </Animated.View>
        <LinearGradient
          colors={[colors.primary, colors.white]}
          style={{
            position: "absolute",
            top: "50%",
            width: 600,
            height: 600,
            borderRadius: 300,
            zIndex: 0,
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
        />
      </View>
    </Pressable>
  );
}
