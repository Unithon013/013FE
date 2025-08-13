import React from "react";
import { Stack } from "expo-router";
import { useLoadFonts } from "../hooks/useLoadFonts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";

export default function RootLayout() {
  useLoadFonts();
  return;
  <QueryClientProvider client={queryClient}>
    <Stack screenOptions={{ headerShown: false }} />{" "}
  </QueryClientProvider>;
}
