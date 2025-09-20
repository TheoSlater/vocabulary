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

  const dynamicStyles = StyleSheet.create({
    card: {
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
    <View style={[dynamicStyles.card, style]}>
      {isWordOfDay && (
        <>
          <Text style={dynamicStyles.heading}>WORD OF THE DAY</Text>
          {date && <Text style={dynamicStyles.date}>{date}</Text>}
        </>
      )}
      <Text style={dynamicStyles.word}>{word.word}</Text>
      <Text style={dynamicStyles.partOfSpeech}>{word.partOfSpeech}</Text>
      <Text style={dynamicStyles.definition}>{word.definition}</Text>
    </View>
  );
};
