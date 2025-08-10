import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

SplashScreen.preventAutoHideAsync();

export function useLoadFonts() {
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.ttf"),
        "Pretendard-Medium": require("../assets/fonts/Pretendard-Medium.ttf"),
        "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.ttf"),
        "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.ttf"),
      });
      await SplashScreen.hideAsync();
    })();
  }, []);
}
