import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Switch,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../contexts/ThemeContext";
import { useHaptics } from "../utils/HapticsManager";

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
  const [switchValue, setSwitchValue] = useState(isDark);
  const [hapticsExpanded, setHapticsExpanded] = useState(false);
  const { config, updateConfig, haptics } = useHaptics();

  // Local state for haptic switches to prevent glitching - with same delay pattern as Dark Mode
  const [hapticSwitches, setHapticSwitches] = useState({
    enabled: config.enabled,
    scrollFeedback: config.scrollFeedback,
    buttonFeedback: config.buttonFeedback,
    successFeedback: config.successFeedback,
    errorFeedback: config.errorFeedback,
    selectionFeedback: config.selectionFeedback,
  });

  useEffect(() => {
    // Add a small delay to prevent choppy animation - SAME AS DARK MODE
    const timer = setTimeout(() => {
      setSwitchValue(isDark);
    }, 100);

    return () => clearTimeout(timer);
  }, [isDark]);

  useEffect(() => {
    // Add a small delay to prevent choppy animation - SAME AS DARK MODE
    const timer = setTimeout(() => {
      setHapticSwitches({
        enabled: config.enabled,
        scrollFeedback: config.scrollFeedback,
        buttonFeedback: config.buttonFeedback,
        successFeedback: config.successFeedback,
        errorFeedback: config.errorFeedback,
        selectionFeedback: config.selectionFeedback,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [config]);

  const handleHapticToggle = async (
    key: keyof typeof config,
    value: boolean
  ) => {
    await updateConfig({ [key]: value });
    // Provide haptic feedback when toggling (with slight delay)
    if (value && (key === "enabled" ? value : hapticSwitches.enabled)) {
      setTimeout(() => haptics.onToggle(), 100);
    }
  };

  const handleIntensityChange = async () => {
    const intensities: Array<"light" | "medium" | "heavy"> = [
      "light",
      "medium",
      "heavy",
    ];
    const currentIndex = intensities.indexOf(config.intensity);
    const nextIndex = (currentIndex + 1) % intensities.length;
    const newIntensity = intensities[nextIndex];

    await updateConfig({ intensity: newIntensity });

    // Test the new intensity
    if (hapticSwitches.enabled) {
      setTimeout(() => haptics.impact(newIntensity), 100);
    }
  };

  const toggleHapticsExpanded = async () => {
    await haptics.onButtonPress();
    setHapticsExpanded(!hapticsExpanded);
  };

  const HapticSettingRow: React.FC<{
    icon: string;
    label: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    disabled?: boolean;
  }> = ({ icon, label, value, onToggle, disabled = false }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginLeft: 16,
        borderRadius: Platform.OS === "ios" ? 8 : 6,
        backgroundColor:
          Platform.OS === "ios" ? theme.colors.background : "transparent",
        borderWidth: Platform.OS === "ios" ? 1 : 0,
        borderColor:
          Platform.OS === "ios" ? theme.colors.border : "transparent",
        marginBottom: 4,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={icon as any} size={18} color={theme.colors.text} />
        <Text
          style={{
            fontSize: 14,
            marginLeft: 12,
            color: theme.colors.text,
            fontWeight: Platform.OS === "ios" ? "400" : "normal",
          }}
        >
          {label}
        </Text>
      </View>
      <Switch
        key={`haptic-${label.toLowerCase().replace(" ", "-")}-${value}`}
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{
          false: Platform.OS === "ios" ? "#767577" : theme.colors.border,
          true:
            Platform.OS === "ios" ? theme.colors.primary : theme.colors.primary,
        }}
        thumbColor={
          Platform.OS === "ios" ? "#f4f3f4" : value ? "#FFFFFF" : "#F4F3F4"
        }
        ios_backgroundColor={theme.colors.border}
        style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
      />
    </View>
  );

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
            height: hapticsExpanded ? (Platform.OS === "ios" ? 500 : 480) : 280,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingBottom: 20,
            paddingTop: 20,
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

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Dark Mode Setting */}
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
              key={`switch-${isDark}`} // Force re-render on theme change
              value={switchValue}
              onValueChange={toggleTheme}
              trackColor={{
                false: Platform.OS === "ios" ? "#767577" : theme.colors.border,
                true:
                  Platform.OS === "ios"
                    ? theme.colors.primary
                    : theme.colors.primary,
              }}
              thumbColor={
                Platform.OS === "ios"
                  ? "#f4f3f4"
                  : switchValue
                    ? "#FFFFFF"
                    : "#F4F3F4"
              }
              ios_backgroundColor={theme.colors.border}
            />
          </Pressable>

          {/* Haptics Dropdown */}
          <Pressable
            onPress={toggleHapticsExpanded}
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
              marginBottom: hapticsExpanded ? 12 : 8,
            })}
            android_ripple={{
              color: theme.colors.primary,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="phone-portrait"
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
                Haptic Feedback
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.text + "80",
                  marginRight: 8,
                }}
              >
                {hapticSwitches.enabled ? "On" : "Off"}
              </Text>
              <Ionicons
                name={hapticsExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.text}
              />
            </View>
          </Pressable>

          {/* Haptics Settings (Expanded) */}
          {hapticsExpanded && (
            <View style={{ marginBottom: 16 }}>
              {/* Master Toggle */}
              <HapticSettingRow
                icon="power"
                label="Enable Haptics"
                value={hapticSwitches.enabled}
                onToggle={(value) => handleHapticToggle("enabled", value)}
              />

              {/* Intensity Setting */}
              <Pressable
                style={({ pressed }) => ({
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginLeft: 16,
                  borderRadius: Platform.OS === "ios" ? 8 : 6,
                  backgroundColor: pressed
                    ? Platform.OS === "ios"
                      ? theme.colors.border + "40"
                      : "rgba(0,0,0,0.03)"
                    : Platform.OS === "ios"
                      ? theme.colors.background
                      : "transparent",
                  borderWidth: Platform.OS === "ios" ? 1 : 0,
                  borderColor:
                    Platform.OS === "ios" ? theme.colors.border : "transparent",
                  marginBottom: 4,
                  opacity: !hapticSwitches.enabled ? 0.5 : 1,
                })}
                android_ripple={{
                  color: theme.colors.primary,
                }}
                disabled={!hapticSwitches.enabled}
                onPress={handleIntensityChange}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="pulse" size={18} color={theme.colors.text} />
                  <Text
                    style={{
                      fontSize: 14,
                      marginLeft: 12,
                      color: theme.colors.text,
                      fontWeight: Platform.OS === "ios" ? "400" : "normal",
                    }}
                  >
                    Intensity
                  </Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 12,
                    minWidth: 50,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 12,
                      fontWeight: "500",
                      textTransform: "capitalize",
                    }}
                  >
                    {config.intensity}
                  </Text>
                </View>
              </Pressable>

              {/* Individual Haptic Types */}
              <HapticSettingRow
                icon="move"
                label="Scroll Feedback"
                value={hapticSwitches.scrollFeedback}
                onToggle={(value) =>
                  handleHapticToggle("scrollFeedback", value)
                }
                disabled={!hapticSwitches.enabled}
              />

              <HapticSettingRow
                icon="radio-button-on"
                label="Button Feedback"
                value={hapticSwitches.buttonFeedback}
                onToggle={(value) =>
                  handleHapticToggle("buttonFeedback", value)
                }
                disabled={!hapticSwitches.enabled}
              />

              <HapticSettingRow
                icon="checkmark-circle"
                label="Success Feedback"
                value={hapticSwitches.successFeedback}
                onToggle={(value) =>
                  handleHapticToggle("successFeedback", value)
                }
                disabled={!hapticSwitches.enabled}
              />

              <HapticSettingRow
                icon="alert-circle"
                label="Error Feedback"
                value={hapticSwitches.errorFeedback}
                onToggle={(value) => handleHapticToggle("errorFeedback", value)}
                disabled={!hapticSwitches.enabled}
              />

              <HapticSettingRow
                icon="options"
                label="Selection Feedback"
                value={hapticSwitches.selectionFeedback}
                onToggle={(value) =>
                  handleHapticToggle("selectionFeedback", value)
                }
                disabled={!hapticSwitches.enabled}
              />

              {/* Test Button */}
              {hapticSwitches.enabled && (
                <Pressable
                  style={({ pressed }) => ({
                    marginTop: 8,
                    marginHorizontal: 16,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    backgroundColor: pressed
                      ? theme.colors.primary + "CC"
                      : theme.colors.primary,
                    borderRadius: Platform.OS === "ios" ? 8 : 6,
                    alignItems: "center",
                  })}
                  android_ripple={{
                    color: "#FFFFFF",
                  }}
                  onPress={async () => {
                    // Test sequence
                    await haptics.selection();
                    setTimeout(() => haptics.impact("light"), 200);
                    setTimeout(() => haptics.impact("medium"), 400);
                    setTimeout(() => haptics.impact("heavy"), 600);
                    setTimeout(() => haptics.success(), 800);
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 14,
                      fontWeight: Platform.OS === "ios" ? "600" : "bold",
                    }}
                  >
                    Test Haptics
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </>
  );
};
