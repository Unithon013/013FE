import React from 'react';
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography } from "@/constants";
import { Call } from "@/assets";

export default function PhoneStart() {
  const router = useRouter();
  return (
    <LinearGradient
      colors={[colors.black, "rgba(0,0,0,0.7)"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: "90%",
        }}
      >
        <Text
          style={[
            typography.h1,
            {
              color: colors.white,
              marginVertical: 3,
              textShadowColor: "rgba(0, 0, 0, 0.2)",
              textShadowOffset: { width: 1, height: 1 }, // 그림자 위치
              textShadowRadius: 4, // 그림자 퍼짐 정도
            },
          ]}
        >
          불씨를 시작하기 위해
        </Text>
        <Text
          style={[
            typography.h1,
            {
              color: colors.white,
              marginVertical: 3,
              textShadowColor: "rgba(0, 0, 0, 0.2)",
              textShadowOffset: { width: 1, height: 1 }, // 그림자 위치
              textShadowRadius: 4, // 그림자 퍼짐 정도
            },
          ]}
        >
          응답해주세요
        </Text>
      </View>
      <Pressable
        onPress={() => router.push("/(onboarding)/4_profile_call")}
        style={{ marginBottom: 100, alignItems: "center" }}
      >
        <Call />
      </Pressable>
    </LinearGradient>
  );
}
