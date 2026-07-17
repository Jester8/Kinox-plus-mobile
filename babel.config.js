module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: { "@": "./src" },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
      // Not adding react-native-reanimated/plugin here — nativewind/babel
      // (react-native-css-interop) already applies react-native-worklets/plugin
      // internally. Adding it a second time double-transforms every worklet
      // and produces corrupted bytecode that crashes at runtime.
    ],
  };
};
