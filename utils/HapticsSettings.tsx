import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useHaptics } from "./HapticsManager";

interface HapticsSettingsProps {
  theme: any; // Replace with your theme type
}

export const HapticsSettings: React.FC<HapticsSettingsProps> = ({ theme }) => {
  const { config, updateConfig, haptics } = useHaptics();

  const handleToggle = async (key: keyof typeof config, value: boolean) => {
    await updateConfig({ [key]: value });
    // Provide haptic feedback when toggling haptic settings (with a slight delay)
    if (value && config.enabled) {
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
    if (config.enabled) {
      setTimeout(() => haptics.impact(newIntensity), 100);
    }
  };

  const testHaptics = async () => {
    if (!config.enabled) {
      Alert.alert("Haptics Disabled", "Please enable haptics to test them.");
      return;
    }

    // Test sequence with delays
    await haptics.selection();
    setTimeout(() => haptics.impact("light"), 200);
    setTimeout(() => haptics.impact("medium"), 400);
    setTimeout(() => haptics.impact("heavy"), 600);
    setTimeout(() => haptics.success(), 800);
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
      marginTop: 16,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border || theme.colors.text + "20",
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary || theme.colors.text + "80",
      marginTop: 2,
    },
    intensityButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.primary || "#007AFF",
      borderRadius: 8,
      minWidth: 80,
      alignItems: "center",
    },
    intensityButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "500",
      textTransform: "capitalize",
    },
    testButton: {
      marginTop: 20,
      padding: 16,
      backgroundColor:
        theme.colors.secondary || theme.colors.primary || "#007AFF",
      borderRadius: 12,
      alignItems: "center",
    },
    testButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    disabledText: {
      color: theme.colors.textSecondary || theme.colors.text + "60",
    },
  });

  const SettingRow: React.FC<{
    label: string;
    description?: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    disabled?: boolean;
  }> = ({ label, description, value, onToggle, disabled = false }) => (
    <View style={dynamicStyles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            dynamicStyles.settingLabel,
            disabled && dynamicStyles.disabledText,
          ]}
        >
          {label}
        </Text>
        {description && (
          <Text
            style={[
              dynamicStyles.settingDescription,
              disabled && dynamicStyles.disabledText,
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{
          false: theme.colors.border || "#767577",
          true: theme.colors.primary || "#007AFF",
        }}
        thumbColor={value ? "#FFFFFF" : "#F4F3F4"}
      />
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.sectionTitle}>Haptic Feedback</Text>

      <SettingRow
        label="Enable Haptics"
        description="Master switch for all haptic feedback"
        value={config.enabled}
        onToggle={(value) => handleToggle("enabled", value)}
      />

      <View style={dynamicStyles.settingRow}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              dynamicStyles.settingLabel,
              !config.enabled && dynamicStyles.disabledText,
            ]}
          >
            Intensity
          </Text>
          <Text
            style={[
              dynamicStyles.settingDescription,
              !config.enabled && dynamicStyles.disabledText,
            ]}
          >
            Strength of haptic feedback
          </Text>
        </View>
        <TouchableOpacity
          style={[
            dynamicStyles.intensityButton,
            !config.enabled && { opacity: 0.5 },
          ]}
          onPress={handleIntensityChange}
          disabled={!config.enabled}
        >
          <Text style={dynamicStyles.intensityButtonText}>
            {config.intensity}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[dynamicStyles.sectionTitle, { marginTop: 24 }]}>
        Feedback Types
      </Text>

      <SettingRow
        label="Scroll Feedback"
        description="Subtle feedback when scrolling snaps to content"
        value={config.scrollFeedback}
        onToggle={(value) => handleToggle("scrollFeedback", value)}
        disabled={!config.enabled}
      />

      <SettingRow
        label="Button Feedback"
        description="Feedback when pressing buttons"
        value={config.buttonFeedback}
        onToggle={(value) => handleToggle("buttonFeedback", value)}
        disabled={!config.enabled}
      />

      <SettingRow
        label="Success Feedback"
        description="Feedback for successful actions"
        value={config.successFeedback}
        onToggle={(value) => handleToggle("successFeedback", value)}
        disabled={!config.enabled}
      />

      <SettingRow
        label="Error Feedback"
        description="Feedback for errors or failed actions"
        value={config.errorFeedback}
        onToggle={(value) => handleToggle("errorFeedback", value)}
        disabled={!config.enabled}
      />

      <SettingRow
        label="Selection Feedback"
        description="Feedback when making selections or toggles"
        value={config.selectionFeedback}
        onToggle={(value) => handleToggle("selectionFeedback", value)}
        disabled={!config.enabled}
      />

      <TouchableOpacity
        style={[dynamicStyles.testButton, !config.enabled && { opacity: 0.5 }]}
        onPress={testHaptics}
        disabled={!config.enabled}
      >
        <Text style={dynamicStyles.testButtonText}>Test Haptics</Text>
      </TouchableOpacity>
    </View>
  );
};
