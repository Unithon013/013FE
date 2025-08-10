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
