import React from 'react';
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Profile30s() {
  const router = useRouter();
  // 여기에서 30초 타이머/녹화/폼 연결 예정
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>30초 프로필 등록</Text>
      <Pressable onPress={() => router.push("/(onboarding)/5_profile_done")}>
        <Text>등록 완료</Text>
      </Pressable>
    </View>
  );
}
