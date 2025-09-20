import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  TouchableOpacity,
  Switch,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getWordOfTheDay,
  getRandomWords,
  getWordDefinition,
} from "./services/api";
import { useTheme, Theme } from "./contexts/ThemeContext";

// Settings Button Component (native style)
interface SettingsButtonProps {
  onPress: () => void;
  theme: Theme;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onPress, theme }) => (
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

// Settings Drawer Component (from bottom)
interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  translateY: Animated.Value;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
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

interface Word {
  word: string;
  definition?: string;
  partOfSpeech?: string;
  isWordOfDay?: boolean;
}

const { height } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [wordOfTheDay, setWordOfTheDay] = useState<Word | null>(null);
  const [randomWords, setRandomWords] = useState<Word[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const translateY = React.useRef(new Animated.Value(300)).current;

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      const wotd = await getWordOfTheDay();
      setWordOfTheDay(wotd);
    };

    const fetchRandomWords = async () => {
      const words = await getRandomWords(50);
      const wordsWithDefinitions: Word[] = [];

      for (const w of words) {
        const def = await getWordDefinition(w);
        wordsWithDefinitions.push(
          def || {
            word: w,
            definition: "No definition",
            partOfSpeech: "unknown",
          }
        );
      }
      setRandomWords(wordsWithDefinitions);
    };

    fetchWordOfTheDay();
    fetchRandomWords();
  }, []);

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

  const today = new Date().toLocaleDateString();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    card: {
      height,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    heading: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      letterSpacing: 2,
    },
    date: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 10,
    },
    word: {
      fontSize: 32,
      fontWeight: "bold",
      marginVertical: 10,
      color: theme.colors.text,
    },
    partOfSpeech: {
      fontStyle: "italic",
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
    definition: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 10,
      color: theme.colors.text,
      lineHeight: 24,
    },
  });

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        style={dynamicStyles.container}
      >
        {wordOfTheDay && (
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.heading}>WORD OF THE DAY</Text>
            <Text style={dynamicStyles.date}>{today}</Text>
            <Text style={dynamicStyles.word}>{wordOfTheDay.word}</Text>
            <Text style={dynamicStyles.partOfSpeech}>
              {wordOfTheDay.partOfSpeech}
            </Text>
            <Text style={dynamicStyles.definition}>
              {wordOfTheDay.definition}
            </Text>
          </View>
        )}

        {randomWords.map((w, idx) => (
          <View key={idx} style={dynamicStyles.card}>
            <Text style={dynamicStyles.word}>{w.word}</Text>
            <Text style={dynamicStyles.partOfSpeech}>{w.partOfSpeech}</Text>
            <Text style={dynamicStyles.definition}>{w.definition}</Text>
          </View>
        ))}
      </ScrollView>

      <SettingsButton onPress={openDrawer} theme={theme} />

      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        translateY={translateY}
        theme={theme}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </>
  );
};

export default HomeScreen;
