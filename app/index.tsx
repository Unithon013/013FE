import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <Text>Home (Expo Router + TS)</Text>
      <Link href="(tabs)/home" asChild>
        <Pressable>
          <Text>Go to Tabs/Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
