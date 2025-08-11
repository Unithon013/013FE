import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, typography } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileDone() {
  const router = useRouter();
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Pressable onPress={() => router.replace("/(onboarding)/6_start")}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={[
              typography.h0,
              {
                color: colors.primary,
                marginVertical: 3,
                textShadowColor: "rgba(0, 0, 0, 0.1)",
                textShadowOffset: { width: 1, height: 1 }, // 그림자 위치
                textShadowRadius: 3, // 그림자 퍼짐 정도
              },
            ]}
          >
            프로필 등록이
          </Text>
          <Text
            style={[
              typography.h0,
              {
                color: colors.textblack,
                marginVertical: 3,
                textShadowColor: "rgba(0, 0, 0, 0.1)",
                textShadowOffset: { width: 1, height: 1 }, // 그림자 위치
                textShadowRadius: 3, // 그림자 퍼짐 정도
              },
            ]}
          >
            완료되었습니다.
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
