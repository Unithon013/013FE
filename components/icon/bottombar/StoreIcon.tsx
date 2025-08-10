// SvgStoreIcon.tsx or .jsx
import React from "react";
import Svg, { Path } from "react-native-svg";

const SvgStoreIcon = ({ color = "#888888", size = 24, ...props }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 41 35" // 원본 크기에 맞춰 필요시 조정
    fill="none"
    {...props}
  >
    <Path
      d="M8.542 6.833h23.916a5.125 5.125 0 0 1 5.125 5.126v6.833H25.625v-1.709h-10.25v1.709H3.417v-6.834a5.125 5.125 0 0 1 5.125-5.125Zm10.25 11.959h3.416v3.416h-3.416v-3.416ZM3.417 20.5h11.958v1.709l3.417 3.416h3.416l3.417-3.416V20.5h11.958v13.667H3.417V20.5Z"
      fill={color}
    />
  </Svg>
);

export default SvgStoreIcon;
