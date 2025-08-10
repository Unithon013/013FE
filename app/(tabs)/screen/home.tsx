// app/(tabs)/home.tsx  혹은 HomeScreen.tsx
import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  FlatList,
  Dimensions,
  StyleSheet,
  ViewToken, FlatListProps,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HomeCharacter from '../../../assets/home_character.svg';
import { Colors, Typo } from "../../../constants";

type Profile = {
  id: string;
  name: string;
  age: number;
  district: string;
  photo: string; // 이미지 URL 또는 require()
};

const { width } = Dimensions.get("window");
const PAGE_WIDTH = width;                    // FlatList 페이징 단위
const CARD_RADIUS = 27;

const DATA: Profile[] = [
  {
    id: "1",
    name: "박막례",
    age: 60,
    district: "동작구",
    photo:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "김영희",
    age: 72,
    district: "성동구",
    photo:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea1?q=80&w=1200&auto=format&fit=crop",
  },
  {   
    id: "3",
    name: "이순자",
    age: 70,
    district: "관악구",
    photo:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HomeScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Profile>>(null);
  const insets = useSafeAreaInsets();

  const onViewRef = useRef<
  NonNullable<FlatListProps<Profile>["onViewableItemsChanged"]>
>(({ viewableItems }) => {
  const first = viewableItems[0];
  if (first && first.index !== null && first.index !== undefined) {
    setIndex(first.index);
  }
}).current;

  const viewabilityConfig = useMemo(
    () => ({ viewAreaCoveragePercentThreshold: 60 }),
    []
  );

  const goPrev = () => {
    if (index <= 0) return;
    listRef.current?.scrollToIndex({ index: index - 1, animated: true });
  };

  const goNext = () => {
    if (index >= DATA.length - 1) return;
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <View style={styles.page}>
      <View style={styles.cardShadow}>
        <ImageBackground
          source={{ uri: item.photo }}
          style={styles.card}
          imageStyle={{ borderRadius: CARD_RADIUS }}
          resizeMode="cover"
        >
          {/* 하단 반투명 오버레이 */}
          <View style={styles.overlay}>
            <View>
              <Text style={styles.nameLine1}>
                {item.district}, {item.age}세
              </Text>
            </View>
            <View style={styles.bottomWrapper}>
              <Text style={styles.nameLine2}>{item.name}</Text>
              <Pressable
                style={styles.videoBtn}
                onPress={() => console.log("소개 영상 보러가기")}
              >
                <Text style={styles.videoBtnText}>소개 영상 보러가기</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      {/* 상단 오렌지 영역 (헤더 대체) */}
      <View style={styles.topHero}>
        <View style={styles.textWrapper}>
          <View>
            <Text style={styles.heroLine1}>
              불씨 AI가 <Text style={{ fontWeight: "700" }}>김숭실님</Text>의
            </Text>
            <Text style={styles.heroLine2}>소개 영상을 분석해 친구를 찾고 있어요.</Text>
          </View>
          <HomeCharacter width={80} height={80}/>
        </View>
      </View>

      <View style={styles.stage}>
        {/* 카드 스와이프 영역 */}
        <View style={styles.middle}>
          <FlatList
            ref={listRef}
            data={DATA}
            keyExtractor={(it) => it.id}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewRef}
            viewabilityConfig={viewabilityConfig}
            getItemLayout={(_, i) => ({
              length: PAGE_WIDTH,
              offset: PAGE_WIDTH * i,
              index: i,
            })}
          />
        </View>
        
        {/* 하단 이전 / 다음 버튼 */}
        <View style={styles.footer}>
          <Pressable
            onPress={goPrev}
            disabled={index === 0}
            style={[styles.prevBtn, index === 0 && styles.disabled]}
          >
            <Text style={[styles.prevText, index === 0 && styles.disabledText]}>
              이전
            </Text>
          </Pressable>

          <Pressable
            onPress={goNext}
            disabled={index === DATA.length - 1}
            style={[styles.nextBtn, index === DATA.length - 1 && styles.disabled]}
          >
            <Text style={styles.nextText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  topHero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
  },
  textWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  heroLine1: { 
    color: Colors.white, 
    fontSize: 17, marginBottom: 2 
  },
  heroLine2: { color: Colors.white, fontSize: 17, fontWeight: "600" },
  page: {
    width: PAGE_WIDTH,
    paddingHorizontal: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  stage: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
  },
  middle: {
    flex: 1,
    justifyContent: "center", 
    paddingTop: 30,
    paddingBottom: 8,
  },
  cardShadow: {
    borderRadius: CARD_RADIUS,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  card: {
    height: 520, // 필요에 맞게 조절
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 16,
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
  },
  bottomWrapper: {
    flexDirection: 'row',
    gap: 30,
  },
  nameLine1: { color: Colors.white, fontSize: 18, fontWeight: "700" },
  nameLine2: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
    marginBottom: 10,
  },
  videoBtn: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  videoBtnText: { color: "#fff", fontWeight: "700" },
  footer: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  prevBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  prevText: { color: Colors.textblack, fontSize: 18, fontWeight: "700" },

  nextBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: { color: "#fff", fontSize: 18, fontWeight: "800" },

  disabled: { opacity: 0.4 },
  disabledText: { color: "#aaa" },
});
