// assets/index.ts
import { Image } from "react-native";

export function Logo() {
  return (
    <Image
      source={require("@/assets/logo.png")}
      style={{ width: 195, height: 122 }}
      resizeMode="contain"
    />
  );
}

export function Ai1() {
  return (
    <Image
      source={require("@/assets/ai1.png")}
      style={{ width: 227, height: 340 }}
      resizeMode="contain"
    />
  );
}

export function Ai2() {
  return (
    <Image
      source={require("@/assets/ai2.png")}
      style={{ width: 227, height: 340 }}
      resizeMode="contain"
    />
  );
}

export function Call() {
  return (
    <Image
      source={require("@/assets/call.png")}
      style={{ width: 91, height: 139 }}
      resizeMode="contain"
    />
  );
}
