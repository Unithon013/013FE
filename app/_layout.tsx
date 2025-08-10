import { Stack } from "expo-router";
import { useLoadFonts } from "../hooks/useLoadFonts";

export default function RootLayout() {
  useLoadFonts();
  return <Stack screenOptions={{ headerShown: false }} />;
}
