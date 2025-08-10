// components/SvgIcon.tsx
import React from "react";
import { ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";
import { LogoSvg } from "@/assets";

type IconName = "Logo";

type Props = SvgProps & {
  name: IconName;
  style?: ViewStyle;
};

/**
 * 사용법:
 *  <SvgIcon name="Logo" width={120} height={120} />
 *  색 변경: <SvgIcon name="Logo" fill="#000" />
 */
export default function SvgIcon({ name, ...svgProps }: Props) {
  const { style, ...rest } = svgProps;
  const common: SvgProps = {
    preserveAspectRatio: "xMidYMid meet",
    style: [{ overflow: "visible" } as ViewStyle, style],
  };

  switch (name) {
    case "Logo":
      return <LogoSvg {...common} {...rest} />;
    default:
      return null;
  }
}
