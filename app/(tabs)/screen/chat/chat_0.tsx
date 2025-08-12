// app/(tabs)/screen/chat/chat_0.tsx
import React, { useLayoutEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { colors, typography } from "@/constants";
import { ChatHeadB, ChatHead } from "@/assets";

// ---- Types ----
type Msg =
  | { id: string; kind: "date"; label: string }
  | {
      id: string;
      kind: "text";
      side: "me" | "other";
      text: string;
      time: string;
    }
  | { id: string; kind: "image"; side: "other"; time: string };

export default function ChatRoom0Screen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // 헤더 활성화 여부 (첫 메시지 보낸 뒤 활성)
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);

  // 메시지 목록 & 입력값
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>(() => [
    { id: "d1", kind: "date", label: "2025년 8월 13일" },
    { id: "m1", kind: "image", side: "other", time: "오후 3:00" },
  ]);

  // 시간 포맷(대충 데모용)
  const nowTime = () => {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "오후" : "오전";
    const hh = ((h + 11) % 12) + 1;
    return `${ampm} ${hh}:${m}`;
  };

  // ----- Header (inactive -> active) -----
  const IMAGE_HEIGHT = 64; // 디자인 가이드: 360x64 (높이만 고정, 가로는 100%)
  const HEADER_H = insets.top + IMAGE_HEIGHT;
  const Header = () => {
    // 이미지 뷰 전체를 채우도록 절대 배치
    return (
      <View
        style={{
          height: 64 + insets.top,
          justifyContent: "center",
        }}
      >
        {/* 헤더 이미지 (가로/세로 꽉차게) */}
        <View
          style={{
            position: "absolute",
            top: insets.top,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {hasSentFirstMessage ? (
            <ChatHead width="100%" height="100%" />
          ) : (
            <ChatHeadB width="100%" height="100%" />
          )}
        </View>

        {/* 뒤로가기 버튼 (세로 가운데) */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            left: 16,
            top: insets.top + 20,
            transform: [{ translateY: -10 }],
            zIndex: 1,
          }}
        >
          <Text style={{ ...typography.h0, color: colors.white }}>‹</Text>
        </Pressable>
      </View>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => <Header />,
      headerTransparent: false,
    });
  }, [navigation, hasSentFirstMessage, insets.top]);

  // Hide bottom tab bar while this chat screen is focused
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent?.();
      // v6+: Hide the tab bar when this screen is in focus
      parent?.setOptions({ tabBarStyle: { display: "none" } });

      // Cleanup: restore the default tab bar style when leaving
      return () => {
        parent?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation])
  );

  // ----- Actions -----
  const send = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: Msg = {
      id: String(Date.now()),
      kind: "text",
      side: "me",
      text,
      time: nowTime(),
    };
    setMsgs((prev) => [...prev, newMsg]);
    setInput("");
    if (!hasSentFirstMessage) setHasSentFirstMessage(true);
  };

  // ----- Render -----
  const renderItem = ({ item }: { item: Msg }) => {
    if (item.kind === "date") {
      return (
        <View style={s.dateChipWrap}>
          <View style={s.dateChip}>
            <Text style={s.dateChipText}>{item.label}</Text>
          </View>
        </View>
      );
    }
    if (item.kind === "image") {
      return (
        <View style={s.msgRowRight}>
          <View style={s.imageDummy}>
            <Text style={s.play}>▶</Text>
          </View>
          <Text style={s.timeLeft}>{item.time}</Text>
        </View>
      );
    }
    // text
    if (item.side === "me") {
      return (
        <View style={s.msgRowRight}>
          <View style={s.bubbleMe}>
            <Text style={s.bubbleMeText}>{item.text}</Text>
          </View>
          <Text style={s.timeRight}>{item.time}</Text>
        </View>
      );
    }
    return (
      <View style={s.msgRowLeft}>
        <View style={s.bubbleOther}>
          <Text style={s.bubbleOtherText}>{item.text}</Text>
        </View>
        <Text style={s.timeLeft}>{item.time}</Text>
      </View>
    );
  };

  const keyExtractor = (it: Msg) => it.id;
  const contentPadBottom = useMemo(
    () => ({ paddingBottom: Math.max(insets.bottom) }),
    [insets.bottom]
  );

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={msgs}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[s.listContent, contentPadBottom]}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Bar */}
      <View style={[s.inputBar, { paddingBottom: Math.max(insets.bottom) }]}>
        <TextInput
          style={s.input}
          placeholder="메세지를 입력하세요."
          placeholderTextColor={colors.textSub2}
          value={input}
          onChangeText={setInput}
          returnKeyType="send"
          onSubmitEditing={send}
        />
        <Pressable onPress={send} style={s.sendBtn}>
          <Text style={s.sendArrow}>↑</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { backgroundColor: colors.white },
  headerImageWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backAbs: {
    position: "absolute",
    left: 12,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { ...typography.h0, color: colors.white },

  listContent: { paddingHorizontal: 16, paddingTop: 12 },
  dateChipWrap: { alignItems: "center", marginVertical: 8 },
  dateChip: {
    backgroundColor: "#EFEFEF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dateChipText: { ...typography.caption, color: colors.textSub1 },

  msgRowLeft: { alignSelf: "flex-start", maxWidth: "80%", marginVertical: 6 },
  msgRowRight: {
    alignSelf: "flex-end",
    maxWidth: "80%",
    marginVertical: 6,
    alignItems: "flex-end",
  },

  bubbleOther: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleOtherText: { ...typography.body, color: colors.textblack },

  bubbleMe: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleMeText: { ...typography.body, color: colors.white },

  timeLeft: {
    ...typography.caption,
    color: colors.textSub2,
    marginTop: 4,
    marginLeft: 6,
  },
  timeRight: { ...typography.caption, color: colors.textSub2, marginTop: 4 },

  imageDummy: {
    width: 160,
    height: 200,
    backgroundColor: "#DDD",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  play: { ...typography.h2, color: colors.textSub1 },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 14,
    ...typography.sub,
    color: colors.textblack,
  },
  sendBtn: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendArrow: { ...typography.h3, color: colors.white },
});
