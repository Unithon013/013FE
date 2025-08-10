import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(
      () => router.replace("/(onboarding)/3_call_start"),
      1200
    );
    return () => clearTimeout(t);
  }, [router]);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>스플래쉬…</Text>
    </View>
  );
}
