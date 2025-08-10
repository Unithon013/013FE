import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function PhoneStart() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>전화 시작 화면</Text>
      <Pressable onPress={() => router.push("/(onboarding)/4_profile_call")}>
        <Text>30초 프로필 등록으로</Text>
      </Pressable>
    </View>
  );
}
