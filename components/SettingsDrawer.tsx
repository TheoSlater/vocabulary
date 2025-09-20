import React from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Switch,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../contexts/ThemeContext";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  translateY: Animated.Value;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  translateY,
  theme,
  isDark,
  toggleTheme,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 280,
            zIndex: 1000,
            borderTopLeftRadius: Platform.OS === "ios" ? 20 : 16,
            borderTopRightRadius: Platform.OS === "ios" ? 20 : 16,
            backgroundColor: theme.colors.surface,
            transform: [{ translateY }],
            ...(Platform.OS === "ios" && {
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }),
            ...(Platform.OS === "android" && {
              elevation: 8,
            }),
          },
        ]}
      >
        {/* Handle bar for iOS style */}
        {Platform.OS === "ios" && (
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#C7C7CC",
              borderRadius: 2,
              alignSelf: "center",
              marginTop: 8,
              marginBottom: 20,
            }}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 20,
            paddingTop: Platform.OS === "android" ? 20 : 0,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: Platform.OS === "ios" ? "600" : "bold",
              color: theme.colors.text,
            }}
          >
            Settings
          </Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              padding: 8,
              borderRadius: Platform.OS === "ios" ? 20 : 24,
              backgroundColor: pressed
                ? Platform.OS === "ios"
                  ? theme.colors.border
                  : "rgba(0,0,0,0.1)"
                : "transparent",
            })}
            android_ripple={{
              color: theme.colors.primary,
              borderless: true,
            }}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </Pressable>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Pressable
            style={({ pressed }) => ({
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 15,
              paddingHorizontal: 16,
              borderRadius: Platform.OS === "ios" ? 12 : 8,
              backgroundColor: pressed
                ? Platform.OS === "ios"
                  ? theme.colors.background
                  : "rgba(0,0,0,0.05)"
                : Platform.OS === "ios"
                  ? theme.colors.background
                  : "transparent",
              borderWidth: Platform.OS === "ios" ? 1 : 0,
              borderColor:
                Platform.OS === "ios" ? theme.colors.border : "transparent",
              marginBottom: 8,
            })}
            android_ripple={{
              color: theme.colors.primary,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={22}
                color={theme.colors.text}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginLeft: 15,
                  color: theme.colors.text,
                  fontWeight: Platform.OS === "ios" ? "400" : "normal",
                }}
              >
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={isDark ? "#FFFFFF" : "#F4F3F4"}
            />
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
};
