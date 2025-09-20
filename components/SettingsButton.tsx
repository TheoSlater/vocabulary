import React from "react";
import { Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../contexts/ThemeContext";

interface SettingsButtonProps {
  onPress: () => void;
  theme: Theme;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  onPress,
  theme,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      {
        position: "absolute",
        bottom: 40,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: Platform.OS === "ios" ? 24 : 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: pressed
          ? Platform.OS === "ios"
            ? theme.colors.border
            : "rgba(0,0,0,0.1)"
          : Platform.OS === "ios"
            ? theme.colors.surface
            : theme.colors.surface,
        borderWidth: Platform.OS === "ios" ? 1 : 0,
        borderColor:
          Platform.OS === "ios" ? theme.colors.border : "transparent",
        zIndex: 100,
        opacity: pressed ? 0.8 : 1,
        ...(Platform.OS === "android" && {
          elevation: pressed ? 1 : 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
        }),
        ...(Platform.OS === "ios" && {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }),
      },
    ]}
    android_ripple={{
      color: theme.colors.primary,
      borderless: false,
    }}
  >
    <Ionicons
      name="settings-outline"
      size={Platform.OS === "ios" ? 20 : 22}
      color={theme.colors.text}
    />
  </Pressable>
);
