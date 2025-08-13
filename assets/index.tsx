// assets/index.ts
import React from "react";
import { Image, ImageProps } from "react-native";

export function Back() {
  return (
    <Image
      source={require("@/assets/back.png")}
      style={{ width: 20, height: 20 }}
      resizeMode="contain"
    />
  );
}

export function ChatHeadB() {
  return (
    <Image
      source={require("@/assets/chat/Beheader.png")}
      style={{ width: "100%", height: 64 }}
      resizeMode="cover"
    />
  );
}
export function ChatHead() {
  return (
    <Image
      source={require("@/assets/chat/unBeheader.png")}
      style={{ width: "100%", height: 64 }}
      resizeMode="cover"
    />
  );
}

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
      style={{ width: 91, height: 91 }}
      resizeMode="contain"
    />
  );
}

export function SoongsilKim() {
  return (
    <Image
      source={require("@/assets/soongsilKim.png")}
      style={{ width: 114, height: 129 }}
      resizeMode="contain"
    />
  );
}

export function Video() {
  return (
    <Image
      source={require("@/assets/video.png")}
      style={{ width: 320, height: 391 }}
      resizeMode="contain"
    />
  );
}

export function OneLine() {
  return (
    <Image source={require("@/assets/mypage/1line.png")} resizeMode="cover" />
  );
}

export function Chart() {
  return (
    <Image
      source={require("@/assets/mypage/chart.png")}
      style={{ width: 310, height: 300 }}
      resizeMode="contain"
    />
  );
}

export function Circle() {
  return (
    <Image
      source={require("@/assets/mypage/circle.png")}
      style={{ width: 50, height: 75 }}
      resizeMode="contain"
    />
  );
}

export function StartButton() {
  return (
    <Image
      source={require("@/assets/start.png")}
      style={{ width: 203, height: 241 }}
      resizeMode="contain"
    />
  );
}

export function HomeCharacter() {
  return (
    <Image
      source={require("@/assets/home_character.png")}
      style={{ width: 80, height: 80 }}
      resizeMode="contain"
    />
  );
}

export function StoreHeader(props: Omit<ImageProps, "source">) {
  return (
    <Image
      source={require("@/assets/store/storeH.png")}
      resizeMode="contain"
      {...props}
      style={[{ width: "100%" }, props?.style]}
    />
  );
}

export function StorePre(props: Omit<ImageProps, "source">) {
  return (
    <Image
      source={require("@/assets/store/store_p.png")}
      resizeMode="contain"
      {...props}
      style={{ width: 360, height: 336 }}
    />
  );
}

export function Tree() {
  return (
    <Image
      source={require("@/assets/store/tree.png")}
      style={{ width: 73, height: 65 }}
      resizeMode="contain"
    />
  );
}

export function GroupCharacter() {
  return (
    <Image
      source={require("@/assets/groupCharacter.png")}
      style={{ width: 74, height: 65 }}
      resizeMode="contain"
    />
  );
}
