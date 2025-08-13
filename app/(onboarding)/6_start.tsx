import React from 'react';
import { View, Text, Pressable, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { colors, typography } from "@/constants";
import { StartButton } from "@/assets";
import { useEffect, useRef } from "react";

export default function Splash() {
  const router = useRouter();

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => router.push("/(tabs)/screen/home")}
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
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "35%",
          }}
        >
          <Text
            style={[
              typography.h1,
              { color: colors.textblack, marginVertical: 3 },
            ]}
          >
            이제 불씨에서
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                typography.h1,
                {
                  color: colors.primary,
                  marginVertical: 3,
                  textShadowColor: "rgba(0, 0, 0, 0.1)",
                  textShadowOffset: { width: 1, height: 1 }, // 그림자 위치
                  textShadowRadius: 4, // 그림자 퍼짐 정도
                },
              ]}
            >
              새로운 사랑을
            </Text>
            <Text
              style={[
                typography.h1,
                { color: colors.textblack, marginVertical: 3 },
              ]}
            >
              {" "}
              만나보세요!
            </Text>
          </View>
          <StartButton />
        </View>
      </View>
    </Pressable>
  );
}
