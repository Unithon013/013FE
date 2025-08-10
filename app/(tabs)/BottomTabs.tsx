// BottomTabs.tsx
import React from 'react';
//아이콘
import {
  HomeIcon,
  ChatIcon,
  StoreIcon,
  MyPageIcon,
} from '../../components/icon/bottombar';
import TextLogo from '../../assets/textLogo.svg';
//폰트, 컬러
import { Colors, Typo } from "../../constants";

import { Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//화면 아래 handle부분 처리
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//각 화면 임포트 - Parent
import HomeScreen from './screen/home';
import ChatScreen from './screen/chat';
import StoreScreen from './screen/store';
import MypageScreen from './screen/mypage';

const Tab = createBottomTabNavigator();

// 공통 헤더 타이틀 컴포넌트
const HeaderTitle = ({ title }: { title: string }) => (
  <View
    style={{
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ ...Typo.body, color: Colors.textblack }}>
      {title}
    </Text>
  </View>
); 

// 공통 탭 라벨 컴포넌트
const TabLabel = ({ focused, label }: { focused: boolean; label: string }) => (
  <Text
    style={[
      Typo.body,
      { color: focused ? Colors.primary : Colors.textSub1 },
    ]}
  >
    {label}
  </Text>
);

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          height: 48 + insets.top,
          backgroundColor: Colors.white,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleAlign: 'center',
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
          backgroundColor: '#FFFFFF',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSub1,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          headerTitle: () => <View />,
          headerStyle: { backgroundColor: Colors.primary },
          headerLeft: () => (
            <View style={{ paddingLeft: 12 }}>
              <TextLogo width={90} height={30} />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              color={focused ? Colors.primary : Colors.textSub1}
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
        component={ChatScreen}
        options={{
          headerTitle: () => <HeaderTitle title="채팅" />,
          tabBarIcon: ({ focused }) => (
            <ChatIcon
              color={focused ? Colors.primary : Colors.textSub1}
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
          headerTitle: () => <HeaderTitle title="상점" />,
          tabBarIcon: ({ focused }) => (
            <StoreIcon
              color={focused ? Colors.primary : Colors.textSub1}
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
          headerTitle: () => <HeaderTitle title="마이 페이지" />,
          tabBarIcon: ({ focused }) => (
            <MyPageIcon
              color={focused ? Colors.primary : Colors.textSub1}
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