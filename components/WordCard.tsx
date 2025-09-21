import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Word } from "../HomeScreen";

interface WordCardProps {
  word: Word;
  isWordOfDay?: boolean;
  date?: string;
  style?: ViewStyle;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isWordOfDay = false,
  date,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: theme.colors.background }, style]}
    >
      {isWordOfDay && (
        <>
          <Text style={[styles.heading, { color: theme.colors.primary }]}>
            WORD OF THE DAY
          </Text>
          {date && (
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {date}
            </Text>
          )}
        </>
      )}
      <Text style={[styles.word, { color: theme.colors.text }]}>
        {word.word}
      </Text>
      {word.partOfSpeech && (
        <Text
          style={[styles.partOfSpeech, { color: theme.colors.textSecondary }]}
        >
          {word.partOfSpeech}
        </Text>
      )}
      {word.definition && (
        <Text style={[styles.definition, { color: theme.colors.text }]}>
          {word.definition}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  date: {
    fontSize: 14,
    marginBottom: 10,
  },
  word: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  partOfSpeech: {
    fontStyle: "italic",
    fontSize: 16,
  },
  definition: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
  },
});
