import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      {/* 필요하면 여기서 탭 추가: <Tabs.Screen name="settings" /> */}
    </Tabs>
  );
}
