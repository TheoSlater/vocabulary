import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
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
      const words = await getRandomWords(10);
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
    </>
  );
};

export default HomeScreen;
