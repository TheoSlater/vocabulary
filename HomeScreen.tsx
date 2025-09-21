import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  getWordOfTheDay,
  getRandomWords,
  getWordDefinition,
} from "./services/api";
import { useTheme } from "./contexts/ThemeContext";
import { SettingsButton } from "./components/SettingsButton";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { WordCard } from "./components/WordCard";
import { useSettingsDrawer } from "./hooks/useSettingsDrawer";
import { Ionicons } from "@expo/vector-icons";
import { PracticeButton } from "./components/PracticeButton";

export interface Word {
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
  const { isDrawerOpen, openDrawer, closeDrawer, translateY } =
    useSettingsDrawer();

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      const wotd = await getWordOfTheDay();
      setWordOfTheDay(wotd);
    };

    const fetchRandomWords = async () => {
      const wordsWithDefinitions: Word[] = [];

      // Get a larger batch to account for words without definitions
      const words = await getRandomWords(30); // Get more than we need

      for (const w of words) {
        if (wordsWithDefinitions.length >= 10) break;

        const def = await getWordDefinition(w);
        // Only add words that have valid definitions
        if (
          def &&
          def.definition &&
          def.definition !== "No definition found."
        ) {
          wordsWithDefinitions.push(def);
        }
      }

      // If we still don't have enough, try one more batch
      if (wordsWithDefinitions.length < 10) {
        const moreWords = await getRandomWords(20);
        for (const w of moreWords) {
          if (wordsWithDefinitions.length >= 10) break;

          const def = await getWordDefinition(w);
          if (
            def &&
            def.definition &&
            def.definition !== "No definition found."
          ) {
            wordsWithDefinitions.push(def);
          }
        }
      }

      setRandomWords(wordsWithDefinitions);
    };

    fetchWordOfTheDay();
    fetchRandomWords();
  }, []);

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
          <WordCard
            word={wordOfTheDay}
            isWordOfDay
            date={today}
            style={dynamicStyles.card}
          />
        )}

        {randomWords.map((word, idx) => (
          <WordCard key={idx} word={word} style={dynamicStyles.card} />
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
      <PracticeButton onPress={() => {}} theme={theme} />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  practiceButton: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3, // shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
