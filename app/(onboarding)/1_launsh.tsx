<<<<<<< HEAD
import React , { useEffect } from 'react';
=======
import React from "react";
>>>>>>> 7274c67 (feat : 비동기 처리로 데이터렌더링 최적화)
import { View, Text, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants";
import { Logo } from "@/assets";

export default function LaunchScreen() {
  const router = useRouter();

  
  return (
    <Pressable
      style={{
        flex: 1,
      }}
      onPress={() => router.push("/(onboarding)/6_start")}
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
