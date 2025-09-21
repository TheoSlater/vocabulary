import React from "react";
import { Pressable, Platform, Text } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Theme } from "../contexts/ThemeContext";

interface PracticeButtonProps {
  onPress: () => void;
  theme: Theme;
}

export const PracticeButton: React.FC<PracticeButtonProps> = ({
  onPress,
  theme,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      {
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: Platform.OS === "ios" ? 24 : 8,
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
      name="school-outline"
      size={Platform.OS === "ios" ? 20 : 22}
      color={theme.colors.text}
      style={{ marginRight: 8 }}
    />
    <Text
      style={{
        color: theme.colors.text,
        fontSize: Platform.OS === "ios" ? 16 : 17,
        fontWeight: "600",
      }}
    >
      Practice
    </Text>
  </Pressable>
);
