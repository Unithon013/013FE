import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={34}
    fill="none"
    {...props}
  >
    <path
      fill="#FC678F"
      d="M15.667 33.292v-11.75H23.5v11.75h9.792V17.625h5.875L19.583 0 0 17.625h5.875v15.667h9.792Z"
    />
  </svg>
)
export default SvgHomeIcon