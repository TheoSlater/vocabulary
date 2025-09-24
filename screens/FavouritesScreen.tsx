import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useFavorites } from "../contexts/FavouritesContext";
import { useHaptics } from "../utils/HapticsManager";
import { FavoriteWord } from "../services/favouritesStorage";

interface FavoritesScreenProps {
  onClose: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onClose,
}) => {
  const { theme, isDark } = useTheme();
  const { favorites, toggleFavorite, refreshFavorites } = useFavorites();
  const { haptics } = useHaptics();

  const handleRemoveFavorite = async (word: FavoriteWord) => {
    try {
      await haptics.onButtonPress();
      await toggleFavorite(word);
      await haptics.success();
    } catch (error) {
      console.error("Error removing favorite:", error);
      Alert.alert("Error", "Failed to remove favorite");
      await haptics.error();
    }
  };

  const handleClearAll = () => {
    if (favorites.length === 0) return;

    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all favorited words?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await haptics.onButtonPress();
              // Remove each favorite one by one to use existing logic
              for (const favorite of favorites) {
                await toggleFavorite(favorite);
              }
              await refreshFavorites();
              await haptics.success();
            } catch (error) {
              console.error("Error clearing favorites:", error);
              Alert.alert("Error", "Failed to clear favorites");
              await haptics.error();
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteWord }) => (
    <View
      style={[styles.favoriteItem, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.favoriteContent}>
        <Text style={[styles.favoriteWord, { color: theme.colors.text }]}>
          {item.word}
        </Text>
        <Text
          style={[
            styles.favoritePartOfSpeech,
            { color: theme.colors.textSecondary },
          ]}
        >
          {item.partOfSpeech}
        </Text>
        <Text style={[styles.favoriteDefinition, { color: theme.colors.text }]}>
          {item.definition}
        </Text>
        <Text
          style={[styles.favoriteDate, { color: theme.colors.textSecondary }]}
        >
          Added {formatDate(item.dateAdded)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="heart" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
    },
    emptyContainer: {
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <View style={dynamicStyles.container}>
        {/* Header */}
        <View style={[styles.header, dynamicStyles.header]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Favorites
            </Text>
            {favorites.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                style={styles.clearButton}
              >
                <Text
                  style={[
                    styles.clearButtonText,
                    { color: theme.colors.primary },
                  ]}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={[
              styles.favoriteCount,
              { color: theme.colors.textSecondary },
            ]}
          >
            {favorites.length} word{favorites.length !== 1 ? "s" : ""} saved
          </Text>
        </View>

        {/* Content */}
        {favorites.length === 0 ? (
          <View style={[styles.emptyContainer, dynamicStyles.emptyContainer]}>
            <Ionicons
              name="heart-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No favorites yet
            </Text>
            <Text
              style={[
                styles.emptyMessage,
                { color: theme.colors.textSecondary },
              ]}
            >
              Tap the heart icon on any word to add it to your favorites
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  favoriteCount: {
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    padding: 20,
  },
  favoriteItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteContent: {
    flex: 1,
    marginRight: 12,
  },
  favoriteWord: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  favoritePartOfSpeech: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 8,
  },
  favoriteDefinition: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  favoriteDate: {
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
