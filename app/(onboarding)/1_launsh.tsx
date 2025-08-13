import React , { useEffect } from 'react';
import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants";
import { Logo } from "@/assets";

export default function LaunchScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(onboarding)/2_splash");
    }, 1000); // 1초 후 이동

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  return (
    <Pressable
      style={{
        flex: 1,
      }}
      onPress={() => router.push("/(onboarding)/2_splash")}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
        }}
      >
        <Logo />
      </View>
    </Pressable>
  );
}
