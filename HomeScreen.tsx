import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Dimensions, StatusBar } from "react-native";
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
import { PracticeButton } from "./components/PracticeButton";
import { useHaptics } from "./utils/HapticsManager";

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

  const { haptics } = useHaptics();

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      const wotd = await getWordOfTheDay();
      setWordOfTheDay(wotd);
    };

    const fetchRandomWords = async () => {
      const wordsWithDefinitions: Word[] = [];

      const words = await getRandomWords(30);

      for (const w of words) {
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

  const handleScrollEnd = async () => {
    await haptics.onScroll();
  };

  const handleSettingsPress = async () => {
    await haptics.onButtonPress();
    openDrawer();
  };

  const handlePracticePress = async () => {
    await haptics.onButtonPress();
    // Practice functionality will be handled by the Practice tab
  };

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
        onMomentumScrollEnd={handleScrollEnd}
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

      <SettingsButton onPress={handleSettingsPress} theme={theme} />

      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        translateY={translateY}
        theme={theme}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Keep PracticeButton if you want quick access, or remove it since there's a Practice tab */}
      <PracticeButton onPress={handlePracticePress} theme={theme} />
    </>
  );
};

export default HomeScreen;
