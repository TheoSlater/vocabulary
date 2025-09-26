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
    <View style={[styles.cardContainer, style]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        {/* Header Section */}
        {isWordOfDay && (
          <View style={styles.headerContainer}>
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.primary + "15" },
              ]}
            >
              <Ionicons
                name="star"
                size={14}
                color={theme.colors.primary}
                style={styles.badgeIcon}
              />
              <Text style={[styles.heading, { color: theme.colors.primary }]}>
                WORD OF THE DAY
              </Text>
            </View>
            {date && (
              <Text
                style={[styles.date, { color: theme.colors.textSecondary }]}
              >
                {date}
              </Text>
            )}
          </View>
        )}

        {/* Word Section */}
        <View style={styles.wordSection}>
          <Text style={[styles.word, { color: theme.colors.text }]}>
            {word.word}
          </Text>

          {word.pronunciation && (
            <Text
              style={[
                styles.pronunciation,
                { color: theme.colors.textSecondary },
              ]}
            >
              {word.pronunciation}
            </Text>
          )}

          {word.partOfSpeech && (
            <View
              style={[
                styles.partOfSpeechContainer,
                { backgroundColor: theme.colors.textSecondary + "10" },
              ]}
            >
              <Text
                style={[
                  styles.partOfSpeech,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {word.partOfSpeech}
              </Text>
            </View>
          )}
        </View>

        {/* Definition Section */}
        {word.definition && (
          <View style={styles.definitionContainer}>
            <View
              style={[
                styles.definitionDivider,
                { backgroundColor: theme.colors.textSecondary + "20" },
              ]}
            />
            <Text style={[styles.definition, { color: theme.colors.text }]}>
              {word.definition}
            </Text>
          </View>
        )}

        {/* Favorite Button */}
        {word.definition && (
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              {
                backgroundColor: isFavorited
                  ? theme.colors.primary + "15"
                  : theme.colors.textSecondary + "08",
                borderColor: isFavorited
                  ? theme.colors.primary + "30"
                  : theme.colors.textSecondary + "20",
              },
            ]}
            onPress={handleFavoritePress}
            disabled={isToggling}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={20}
              color={
                isFavorited ? theme.colors.primary : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.favoriteText,
                {
                  color: isFavorited
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                },
              ]}
            >
              {isFavorited ? "Favorited" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  badgeIcon: {
    marginRight: 6,
  },
  heading: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  date: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.8,
  },
  wordSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  word: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  pronunciation: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 12,
    opacity: 0.8,
  },
  partOfSpeechContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partOfSpeech: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  definitionContainer: {
    marginBottom: 20,
  },
  definitionDivider: {
    height: 1,
    width: "100%",
    marginBottom: 16,
  },
  definition: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "400",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    alignSelf: "center",
    minWidth: 160,
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
