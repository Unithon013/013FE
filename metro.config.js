// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// SVG 트랜스포머 연결
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

// .svg는 asset에서 제외, source 확장자로 포함
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

module.exports = config;
