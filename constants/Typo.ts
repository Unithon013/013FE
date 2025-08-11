export const fontFamily = {
  regular: "Pretendard-Regular",
  medium: "Pretendard-Medium",
  semibold: "Pretendard-SemiBold",
  bold: "Pretendard-Bold",
} as const;

export const typography = {
  h0: { fontFamily: fontFamily.bold, fontSize: 40, lineHeight: 40 },
  h1: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 36 },
  h2: { fontFamily: fontFamily.semibold, fontSize: 24, lineHeight: 32 },
  h3: { fontFamily: fontFamily.semibold, fontSize: 20, lineHeight: 28 },
  title: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 26 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  sub: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  subB: { fontFamily: fontFamily.bold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
} as const;

export type TextVariant = keyof typeof typography;
