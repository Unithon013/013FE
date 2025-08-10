// SvgChatIcon.tsx
import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

type Props = SvgProps & { color?: string; size?: number };

export default function SvgChatIcon({ color = "#888888", size = 24, ...props }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 35 35" fill="none" {...props}>
      <Path
        d="M17.5 32.813c9.664 0 17.5-6.856 17.5-15.313S27.164 2.187 17.5 2.187 0 9.043 0 17.5c0 3.85 1.625 7.372 4.31 10.063-.213 2.222-.913 4.659-1.687 6.488-.173.407.162.861.597.791 4.935-.809 7.868-2.051 9.144-2.699 1.675.449 3.402.674 5.136.67Z"
        fill={color}
      />
    </Svg>
  );
}
