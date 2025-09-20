import { useState, useRef } from "react";
import { Animated } from "react-native";

export const useSettingsDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const translateY = useRef(new Animated.Value(300)).current;

  const openDrawer = () => {
    setIsDrawerOpen(true);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setIsDrawerOpen(false));
  };

  return {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    translateY,
  };
};
