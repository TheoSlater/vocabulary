import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  View,
} from "react-native";
import {
  getWordOfTheDay,
  getRandomWords,
  getWordDefinition,
} from "./services/api";
import { useTheme } from "./contexts/ThemeContext";
import { SettingsButton } from "./components/SettingsButton";
import { FavoritesButton } from "./components/FavouritesButton";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { WordCard } from "./components/WordCard";
import { FavoritesScreen } from "./screens/FavouritesScreen";
import { useSettingsDrawer } from "./hooks/useSettingsDrawer";
import { PracticeButton } from "./components/PracticeButton";
import { useHaptics } from "./utils/HapticsManager";

export interface Word {
  word: string;
  definition?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  isWordOfDay?: boolean;
}

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [wordOfTheDay, setWordOfTheDay] = useState<Word | null>(null);
  const [randomWords, setRandomWords] = useState<Word[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isDrawerOpen, openDrawer, closeDrawer, translateY } =
    useSettingsDrawer();

  const { haptics } = useHaptics();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch word of the day and random words in parallel
        const [wotd, words] = await Promise.all([
          getWordOfTheDay(),
          getRandomWords(30),
        ]);

        setWordOfTheDay(wotd);

        // Process random words with definitions
        const wordsWithDefinitions: Word[] = [];

        for (const w of words) {
          if (wordsWithDefinitions.length >= 10) break;

          try {
            const def = await getWordDefinition(w.word);
            if (
              def &&
              def.definition &&
              def.definition !== "No definition found."
            ) {
              wordsWithDefinitions.push(def);
            }
          } catch (error) {
            console.warn(`Failed to fetch definition for ${w.word}:`, error);
          }
        }

        // If we don't have enough words, fetch more
        if (wordsWithDefinitions.length < 10) {
          const moreWords = await getRandomWords(20);
          for (const w of moreWords) {
            if (wordsWithDefinitions.length >= 10) break;

            try {
              const def = await getWordDefinition(w.word);
              if (
                def &&
                def.definition &&
                def.definition !== "No definition found."
              ) {
                wordsWithDefinitions.push(def);
              }
            } catch (error) {
              console.warn(`Failed to fetch definition for ${w.word}:`, error);
            }
          }
        }

        setRandomWords(wordsWithDefinitions);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date().toLocaleDateString();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    card: {
      height: screenHeight,
      width: screenWidth,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    buttonContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "box-none",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
  });

  const handleScrollEnd = async () => {
    try {
      await haptics.onScroll();
    } catch (error) {
      console.warn("Haptics error:", error);
    }
  };

  const handleSettingsPress = async () => {
    try {
      await haptics.onButtonPress();
    } catch (error) {
      console.warn("Haptics error:", error);
    }
    openDrawer();
  };

  const handlePracticePress = async () => {
    try {
      await haptics.onButtonPress();
    } catch (error) {
      console.warn("Haptics error:", error);
    }
    // TODO: Navigate to Practice Screen
  };

  const handleFavoritesPress = async () => {
    try {
      await haptics.onButtonPress();
    } catch (error) {
      console.warn("Haptics error:", error);
    }
    setShowFavorites(!showFavorites);
  };

  const handleCloseFavorites = async () => {
    try {
      await haptics.onButtonPress();
    } catch (error) {
      console.warn("Haptics error:", error);
    }
    setShowFavorites(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        {/* Add your loading component here */}
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.background}
        />
      </View>
    );
  }

  // Show favorites screen if showFavorites is true
  if (showFavorites) {
    return (
      <View style={dynamicStyles.container}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.background}
        />
        <FavoritesScreen onClose={handleCloseFavorites} />

        <View style={dynamicStyles.buttonContainer}>
          <FavoritesButton
            onPress={handleFavoritesPress}
            theme={theme}
            isOnFavoritesScreen={true}
          />
          <SettingsButton onPress={handleSettingsPress} theme={theme} />
        </View>

        <SettingsDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          translateY={translateY}
          theme={theme}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />

      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        style={dynamicStyles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        onMomentumScrollEnd={handleScrollEnd}
        bounces={false}
        decelerationRate="fast"
      >
        {wordOfTheDay && (
          <WordCard
            word={wordOfTheDay}
            isWordOfDay
            date={today}
            style={dynamicStyles.card}
          />
        )}

        {randomWords.map((word, idx) => (
          <WordCard
            key={`${word.word}-${idx}`}
            word={word}
            style={dynamicStyles.card}
          />
        ))}
      </ScrollView>

      <View style={dynamicStyles.buttonContainer}>
        <FavoritesButton
          onPress={handleFavoritesPress}
          theme={theme}
          isOnFavoritesScreen={false}
        />
        <SettingsButton onPress={handleSettingsPress} theme={theme} />
        <PracticeButton onPress={handlePracticePress} theme={theme} />
      </View>

      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        translateY={translateY}
        theme={theme}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </View>
  );
};

export default HomeScreen;
