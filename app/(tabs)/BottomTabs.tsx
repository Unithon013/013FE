// BottomTabs.tsx
import React from "react";
//아이콘
import {
  HomeIcon,
  ChatIcon,
  StoreIcon,
  MyPageIcon,
} from "../../components/icon/bottombar";
import TextLogo from "../../assets/textLogo.svg";
//폰트, 컬러
import { colors, typography } from "../../constants";

import { Text, View } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//화면 아래 handle부분 처리
import { useSafeAreaInsets } from "react-native-safe-area-context";

//각 화면 임포트 - Parent
import HomeScreen from "./screen/home";
import ChatScreen from "./screen/chat/index";
import Chat0Screen from "./screen/chat/chat_0";
import StoreScreen from "./screen/store";
import MypageScreen from "./screen/mypage";

const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

// 공통 헤더 타이틀 컴포넌트
const HeaderTitle = ({ title }: { title: string }) => (
  <View
    style={{
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ ...typography.body, color: colors.textblack }}>{title}</Text>
  </View>
);

// 공통 탭 라벨 컴포넌트
const TabLabel = ({ focused, label }: { focused: boolean; label: string }) => (
  <Text
    style={[
      typography.body,
      { color: focused ? colors.primary : colors.textSub1 },
    ]}
  >
    {label}
  </Text>
);

function ChatStackScreen() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: true }}>
      <ChatStack.Screen
        name="ChatList"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen
        name="Chat0"
        component={Chat0Screen}
        options={{ title: "채팅방" }}
      />
    </ChatStack.Navigator>
  );
}

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          height: 48 + insets.top,
          backgroundColor: colors.white,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTitleAlign: "center",
        tabBarStyle: {
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
          backgroundColor: "#FFFFFF",
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSub1,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          headerTitle: () => <View />,
          headerStyle: { backgroundColor: colors.primary },
          headerLeft: () => (
            <View style={{ paddingLeft: 12 }}>
              <TextLogo width={90} height={30} />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              color={focused ? colors.primary : colors.textSub1}
              width={25}
              height={25}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="홈" />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackScreen}
        options={{
          headerShown: false,
          headerTitle: () => <HeaderTitle title="채팅" />,
          tabBarIcon: ({ focused }) => (
            <ChatIcon
              color={focused ? colors.primary : colors.textSub1}
              width={23}
              height={23}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="채팅" />
          ),
        }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          headerShown: false,
          headerTitle: () => <HeaderTitle title="상점" />,
          tabBarIcon: ({ focused }) => (
            <StoreIcon
              color={focused ? colors.primary : colors.textSub1}
              width={26}
              height={26}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="상점" />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MypageScreen}
        options={{
          headerShown: false,
          headerTitle: () => <HeaderTitle title="마이 페이지" />,
          tabBarIcon: ({ focused }) => (
            <MyPageIcon
              color={focused ? colors.primary : colors.textSub1}
              width={34}
              height={34}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} label="마이페이지" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
