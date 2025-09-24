import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface HapticsConfig {
  enabled: boolean;
  scrollFeedback: boolean;
  buttonFeedback: boolean;
  successFeedback: boolean;
  errorFeedback: boolean;
  selectionFeedback: boolean;
  intensity: "light" | "medium" | "heavy";
}

export const DEFAULT_HAPTICS_CONFIG: HapticsConfig = {
  enabled: true,
  scrollFeedback: true,
  buttonFeedback: true,
  successFeedback: true,
  errorFeedback: true,
  selectionFeedback: true,
  intensity: "medium",
};

class HapticsManager {
  private config: HapticsConfig = DEFAULT_HAPTICS_CONFIG;
  private storageKey = "haptics_config";

  constructor() {
    this.loadConfig();
  }

  // Load haptics configuration from AsyncStorage
  private async loadConfig(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (stored) {
        this.config = { ...DEFAULT_HAPTICS_CONFIG, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn("Failed to load haptics config:", error);
    }
  }

  // Save haptics configuration to AsyncStorage
  private async saveConfig(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.config));
    } catch (error) {
      console.warn("Failed to save haptics config:", error);
    }
  }

  // Get current configuration
  getConfig(): HapticsConfig {
    return { ...this.config };
  }

  // Update configuration
  async updateConfig(updates: Partial<HapticsConfig>): Promise<void> {
    this.config = { ...this.config, ...updates };
    await this.saveConfig();
  }

  // Get impact style based on intensity setting
  private getImpactStyle(): Haptics.ImpactFeedbackStyle {
    switch (this.config.intensity) {
      case "light":
        return Haptics.ImpactFeedbackStyle.Light;
      case "heavy":
        return Haptics.ImpactFeedbackStyle.Heavy;
      default:
        return Haptics.ImpactFeedbackStyle.Medium;
    }
  }

  // Haptic feedback methods
  async impact(type?: "light" | "medium" | "heavy"): Promise<void> {
    if (!this.config.enabled) return;

    const style = type
      ? type === "light"
        ? Haptics.ImpactFeedbackStyle.Light
        : type === "heavy"
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Medium
      : this.getImpactStyle();

    try {
      await Haptics.impactAsync(style);
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
  }

  async selection(): Promise<void> {
    if (!this.config.enabled || !this.config.selectionFeedback) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.warn("Selection haptic failed:", error);
    }
  }

  async success(): Promise<void> {
    if (!this.config.enabled || !this.config.successFeedback) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn("Success haptic failed:", error);
    }
  }

  async error(): Promise<void> {
    if (!this.config.enabled || !this.config.errorFeedback) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn("Error haptic failed:", error);
    }
  }

  async warning(): Promise<void> {
    if (!this.config.enabled) return;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn("Warning haptic failed:", error);
    }
  }

  // Specific feedback methods for different interactions
  async onScroll(): Promise<void> {
    if (!this.config.scrollFeedback) return;
    await this.impact("light");
  }

  async onButtonPress(): Promise<void> {
    if (!this.config.buttonFeedback) return;
    await this.impact();
  }

  async onToggle(): Promise<void> {
    if (!this.config.selectionFeedback) return;
    await this.selection();
  }

  async onCardFlip(): Promise<void> {
    if (!this.config.enabled) return;
    await this.impact("medium");
  }

  async onSwipeAction(): Promise<void> {
    if (!this.config.enabled) return;
    await this.impact("light");
  }
}

// Export singleton instance
export const hapticsManager = new HapticsManager();

// React Hook for haptics management
import { useState, useEffect } from "react";

export const useHaptics = () => {
  const [config, setConfig] = useState<HapticsConfig>(
    hapticsManager.getConfig()
  );

  useEffect(() => {
    // Update local state when config changes
    setConfig(hapticsManager.getConfig());
  }, []);

  const updateHapticsConfig = async (updates: Partial<HapticsConfig>) => {
    await hapticsManager.updateConfig(updates);
    setConfig(hapticsManager.getConfig());
  };

  return {
    config,
    updateConfig: updateHapticsConfig,
    haptics: {
      impact: hapticsManager.impact.bind(hapticsManager),
      selection: hapticsManager.selection.bind(hapticsManager),
      success: hapticsManager.success.bind(hapticsManager),
      error: hapticsManager.error.bind(hapticsManager),
      warning: hapticsManager.warning.bind(hapticsManager),
      onScroll: hapticsManager.onScroll.bind(hapticsManager),
      onButtonPress: hapticsManager.onButtonPress.bind(hapticsManager),
      onToggle: hapticsManager.onToggle.bind(hapticsManager),
      onCardFlip: hapticsManager.onCardFlip.bind(hapticsManager),
      onSwipeAction: hapticsManager.onSwipeAction.bind(hapticsManager),
    },
  };
};
