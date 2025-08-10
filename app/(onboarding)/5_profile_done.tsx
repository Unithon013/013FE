import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function ProfileDone() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>프로필 등록 완료 🎉</Text>
      <Pressable onPress={() => router.replace("/(tabs)/home")}>
        <Text>홈으로 이동</Text>
      </Pressable>
    </View>
  );
}
