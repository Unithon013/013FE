import { View, Text, Pressable, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { colors, typography } from "@/constants";
import { Ai2 } from "@/assets";
import { useEffect, useRef } from "react";

export default function Splash() {
  const router = useRouter();
  const bobY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobY, {
          toValue: -5,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bobY, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
      bobY.stopAnimation();
    };
  }, [bobY]);

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
            zIndex: 1,
            alignItems: "center",
            position: "absolute",
            top: "27%",
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
              justifyContent: "center",
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
        </View>
        <Animated.View
          style={{
            position: "absolute",
            bottom: 30,
            alignSelf: "center",
            zIndex: 1,
            transform: [{ translateY: bobY }],
          }}
        >
          <Ai2 />
        </Animated.View>
      </View>
    </Pressable>
  );
}
