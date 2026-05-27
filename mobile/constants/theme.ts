/**
 * Expo navigation / icon colors aligned with global.css tokens (light mode).
 */

import { Platform } from "react-native";

import { themeColors } from "@/lib/theme-colors";

const tintColorLight = themeColors.primary;
const tintColorDark = "#4ade80";

export const Colors = {
  light: {
    text: themeColors.foreground,
    background: "#fafcfb",
    tint: tintColorLight,
    icon: themeColors.mutedIcon,
    tabIconDefault: themeColors.mutedIcon,
    tabIconSelected: tintColorLight,
    border: themeColors.border,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#374151",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
