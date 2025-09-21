import React from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
        borderRadius: 24,
        backgroundColor: pressed ? theme.colors.border : theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        zIndex: 100,
        opacity: pressed ? 0.8 : 1,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    ]}
  >
    <Ionicons
      name="school-outline"
      size={20}
      color={theme.colors.text}
      style={{ marginRight: 8 }}
    />
    <Text
      style={{
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: "600",
      }}
    >
      Practice
    </Text>
  </Pressable>
);
