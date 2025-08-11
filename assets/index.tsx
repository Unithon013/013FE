// assets/index.ts
import React from "react";
import { Image, ImageProps } from "react-native";

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

export function SoongsilKim() {
  return (
    <Image
      source={require("@/assets/soongsilKim.png")}
      style={{ width: 114, height: 129 }}
      resizeMode="contain"
    />
  );
}

export function StoreHeader(props: Omit<ImageProps, "source">) {
  return (
    <Image
      source={require("@/assets/store/header.png")}
      resizeMode="contain"
      {...props}
      style={[{ width: "100%" }, props?.style]}
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
