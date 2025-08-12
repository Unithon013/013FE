import React, { useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { colors, typography } from "@/constants";
import { Back } from "@/assets";

export default function ReelsPage() {
  const route = useRoute();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent?.();
      parent?.setOptions({ tabBarStyle: { display: "none" } });
      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );
  // @ts-ignore
  const { imageUrl, district, age, name } = route.params || {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Back />
          <Text style={styles.backText}>이전</Text>
        </Pressable>
        <View style={styles.overlay}>
          <View style={{ justifyContent: "center", flex: 1 }}>
            <Text style={styles.nameLine1}>
              {district}, {age}세
            </Text>
            <Text style={styles.nameLine2}>{name}</Text>
          </View>
          <Pressable style={styles.videoBtn}>
            <Text style={styles.videoBtnText}>연락하기</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    hight: 160,
  },
  nameLine1: { color: colors.white, fontSize: 18, fontWeight: "700" },
  nameLine2: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
    marginBottom: 10,
  },
  videoBtn: {
    alignSelf: "flex-start",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  videoBtnText: { color: colors.white, ...typography.h3 },
  backBtn: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: { ...typography.h3, color: colors.white },
});
