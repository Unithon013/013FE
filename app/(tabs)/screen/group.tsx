// app/(tabs)/home.tsx  혹은 HomeScreen.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GroupCharacter } from "@/assets";
import { useNavigation } from "@react-navigation/native";
import { GolfSvg, BustSvg, BackpackSvg, TeaSvg, BadukSvg } from "@/assets/groupsvg";

import { colors, typography } from "../../../constants";

const { width } = Dimensions.get("window");

const BASE_CARD_H = 520; //카드 기본 크기
const MIDDLE_VPAD = 30 + 8;

type CardProps = {
  title: string;
  subtitle: string;
  date: string;
  metaLeft: string;
  metaRight?: string;
  bg: string;
  TitleColor?: string;
  DateColor?: string;
  SubColor?: string;
  Svg: React.ComponentType<{ width?: number; height?: number }>;
};


export default function GroupScreen() {
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();


  //카드 크기 조절
  const [middleH, setMiddleH] = useState(0);
  const cardH = Math.max(
    280, //카드 크기 최소값
    Math.min(BASE_CARD_H, middleH - MIDDLE_VPAD)
  );
  

  
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.primary }}
      edges={["top"]}
    >
      <View style={s.topHero}>
        <View style={s.textWrapper}>
          <View>
            <Text style={s.heroLine1}>사용자들끼리의</Text>
            <Text style={s.heroLine2}>
              개인적인 모임을 가져보세요
            </Text>
          </View>
          <GroupCharacter />
        </View>
      </View>

      <View style={s.stage}>
        <View style={s.headerWrap}>
            <View style={s.headerBar} />
            <Text style={s.headerTitle}>모임목록</Text>
        </View>
        <ScrollView>
            <Card
                title="Greenbella"
                subtitle="그린벨라 시니어 골프모임"
                date="8월 13일"
                metaLeft="최대 20 명"
                metaRight="참여 17 명"
                bg="#321A1A"
                TitleColor="#FE6F0F"
                DateColor="#FE6F0F"
                SubColor="#FFFFFF"
                Svg={GolfSvg}
            />
            <Card
                title="Atelier"
                subtitle="예술·공방·취미 활동"
                date="8월 15일"
                metaLeft="최대 10 명"
                metaRight="참여 5 명"
                bg="#57081D"
                TitleColor="#E0A888"
                DateColor="#E0A888"
                SubColor="#FFFFFF"
                Svg={BustSvg}
            />
            <Card
                title="청봉회"
                subtitle="푸른봉우리에 모인 사람들"
                date="8월 16일"
                metaLeft="최대 15 명"
                metaRight="참여 8 명"
                bg="#355B3D"
                TitleColor="#FFFFFF"
                DateColor="#FFFFFF"
                SubColor="#FFFFFF"
                Svg={BackpackSvg}
            />
            <Card
                title="청향회"
                subtitle="맑고 향기로운 다도모임"
                date="8월 17일"
                metaLeft="최대 10 명"
                metaRight="참여 4 명"
                bg="#FFF9E6"
                TitleColor="#000000"
                DateColor="#81A63F"
                SubColor="#060606"
                Svg={TeaSvg}
            />
            <Card
                title="백흑연"
                subtitle="흑과백이 맺는 인연"
                date="8월 20일"
                metaLeft="최대 11 명"
                metaRight="참여 5 명"
                bg="#3776BF"
                TitleColor="#000000"
                DateColor="#141414"
                SubColor="#FFFFFF"
                Svg={BadukSvg}
            />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Card({
  title,
  subtitle,
  date,
  metaLeft,
  metaRight,
  bg,
  TitleColor = "#FFFFFF",
  SubColor = "#FFFFFF",
  DateColor = "#000000",
  Svg,
}: CardProps) {
  const titleColor = TitleColor;
  const textDate = DateColor;
  const textSub = SubColor;
  return (
    <View style={[s.card, { backgroundColor: bg }]}>
      {/* 텍스트 영역 */}
      <View style={s.textWrap}>
        <Text style={[s.title, { color: titleColor }]}>{title}</Text>
        <Text style={[s.subtitle, { color: textSub }]}>{subtitle}</Text>
        <View style={s.metaWrap}>
          <Text style={[s.metaDate, { color: textDate }]}>{date}</Text>
          <View style={s.metaRow}>
            <Text style={[s.meta, { color: textSub }]}>{metaLeft}</Text>
            {metaRight ? (
              <Text style={[s.meta, { color: textSub, marginLeft: 8 }]}>
                {metaRight}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* 오른쪽 이미지(SVG) */}
      <View style={s.svgWrap}>
        <Svg width={150} height={150} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  topHero: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLine1: {
    color: colors.white,
    ...typography.bodyB,
    marginBottom: 2,
  },
  heroLine2: { color: colors.white, 
    ...typography.bodyB,},
  headerWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 13,
  },
  headerBar: {
    width: 8,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textblack,
  },
  stage: {
    flex: 11,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
  },
  card: {
    borderRadius: 19,
    padding: 16,
    minHeight: 150,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  textWrap: {
    maxWidth: "68%", 
  },
  title: {
    ...typography.h2,
  },
  subtitle: {
    ...typography.title, fontSize: 18
  },
  metaWrap: { marginTop: 20 },
  metaDate: { ...typography.subB},
  metaRow: { flexDirection: "row", marginTop: 5 },
  meta: { ...typography.caption },

  svgWrap: {
    position: "absolute",
    right: 12,
    bottom: 0,
    transform: [{ translateY: 8 }],
    opacity: 0.95,
  },
});
