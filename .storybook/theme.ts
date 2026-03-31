import { create } from "storybook/theming/create";

export default create({
  base: "light",

  // Catppuccin Latte palette
  colorPrimary: "#8839ef", // Mauve
  colorSecondary: "#1e66f5", // Blue

  // UI
  appBg: "#e6e9ef", // Mantle
  appContentBg: "#eff1f5", // Base
  appPreviewBg: "#eff1f5", // Base
  appBorderColor: "#ccd0da", // Surface 0
  appBorderRadius: 6,

  // Text
  textColor: "#4c4f69", // Text
  textInverseColor: "#eff1f5", // Base
  textMutedColor: "#6c6f85", // Subtext 0

  // Toolbar
  barBg: "#e6e9ef", // Mantle
  barTextColor: "#5c5f77", // Subtext 1
  barSelectedColor: "#8839ef", // Mauve
  barHoverColor: "#1e66f5", // Blue

  // Form
  inputBg: "#eff1f5", // Base
  inputBorder: "#bcc0cc", // Surface 1
  inputTextColor: "#4c4f69", // Text
  inputBorderRadius: 4,

  // Booleans
  booleanBg: "#ccd0da", // Surface 0
  booleanSelectedBg: "#8839ef", // Mauve

  // Button
  buttonBg: "#ccd0da", // Surface 0
  buttonBorder: "#bcc0cc", // Surface 1
});
