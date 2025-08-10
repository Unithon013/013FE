import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function LaunchScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>런치스크린</Text>
      <Pressable onPress={() => router.push("/(onboarding)/2_splash")}>
        <Text>시작하기</Text>
      </Pressable>
    </View>
  );
}
