import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../contexts/ThemeContext";

interface FavoritesButtonProps {
  onPress: () => void;
  theme: Theme;
  isOnFavoritesScreen?: boolean;
}

export const FavoritesButton: React.FC<FavoritesButtonProps> = ({
  onPress,
  theme,
  isOnFavoritesScreen = false,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      {
        position: "absolute",
        bottom: 40,
        left: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
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
      name={isOnFavoritesScreen ? "home-outline" : "heart-outline"}
      size={20}
      color={theme.colors.text}
    />
  </Pressable>
);
