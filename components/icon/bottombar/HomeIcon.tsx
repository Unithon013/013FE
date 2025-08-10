// SvgHomeIcon.tsx or .jsx
import React from "react";
import Svg, { Path } from "react-native-svg";

const SvgHomeIcon = ({ color = "#888888", size = 24, ...props }) => (
  <Svg
    width={size}
    height={(size * 34) / 40} // 원본 비율(40x34) 유지
    viewBox="0 0 40 34"
    fill="none"
    {...props}
  >
    <Path
      d="M15.667 33.292v-11.75H23.5v11.75h9.792V17.625h5.875L19.583 0 0 17.625h5.875v15.667h9.792Z"
      fill={color}
    />
  </Svg>
);

export default SvgHomeIcon;
