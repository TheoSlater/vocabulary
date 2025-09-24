import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useFavorites } from "../contexts/FavouritesContext";
import { useHaptics } from "../utils/HapticsManager";
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
  const { isWordFavorited, toggleFavorite } = useFavorites();
  const { haptics } = useHaptics();
  const [isToggling, setIsToggling] = useState(false);

  const isFavorited = isWordFavorited(word.word);

  const handleFavoritePress = async () => {
    if (isToggling || !word.definition) return;

    try {
      setIsToggling(true);
      await haptics.onButtonPress();

      const wordDefinition = {
        word: word.word,
        definition: word.definition,
        partOfSpeech: word.partOfSpeech || "unknown",
        isWordOfDay: word.isWordOfDay,
      };

      await toggleFavorite(wordDefinition);

      // Provide feedback
      await haptics.success();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorites. Please try again.", [
        { text: "OK" },
      ]);
      await haptics.error();
    } finally {
      setIsToggling(false);
    }
  };

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

      <View style={styles.wordContainer}>
        <Text style={[styles.word, { color: theme.colors.text }]}>
          {word.word}
        </Text>

        {/* Favorite Button - only show if word has definition */}
        {word.definition && (
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              {
                backgroundColor: isFavorited
                  ? theme.colors.primary + "20"
                  : theme.colors.textSecondary + "10",
              },
            ]}
            onPress={handleFavoritePress}
            disabled={isToggling}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={24}
              color={
                isFavorited ? theme.colors.primary : theme.colors.textSecondary
              }
            />
          </TouchableOpacity>
        )}
      </View>

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

      {isFavorited && (
        <Text style={[styles.favoritedLabel, { color: theme.colors.primary }]}>
          ★ Favorited
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
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 15,
  },
  word: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 40,
    minHeight: 40,
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
  favoritedLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    opacity: 0.8,
  },
});
