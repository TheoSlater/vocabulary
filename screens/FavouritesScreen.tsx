import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
  Animated,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical">("recent");
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleRemoveFavorite = async (word: FavoriteWord) => {
    try {
      await haptics.onButtonPress();

      // Add fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(async () => {
        await toggleFavorite(word);
        await haptics.success();

        // Fade back in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
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
      "Are you sure you want to remove all favorited words? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await haptics.onButtonPress();
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

  const handleSortToggle = async () => {
    await haptics.onButtonPress();
    setSortBy((prev) => (prev === "recent" ? "alphabetical" : "recent"));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const getFilteredAndSortedFavorites = () => {
    let filtered = favorites;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = favorites.filter(
        (item) =>
          item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.partOfSpeech.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.word.localeCompare(b.word);
      } else {
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      }
    });
  };

  const filteredFavorites = getFilteredAndSortedFavorites();

  const renderFavoriteItem = ({
    item,
    index,
  }: {
    item: FavoriteWord;
    index: number;
  }) => (
    <Animated.View
      style={[
        styles.favoriteItem,
        {
          backgroundColor: theme.colors.surface,
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.favoriteContent}>
        <View style={styles.wordHeader}>
          <Text style={[styles.favoriteWord, { color: theme.colors.text }]}>
            {item.word}
          </Text>
          {item.isWordOfDay && (
            <View
              style={[
                styles.wotdBadge,
                { backgroundColor: theme.colors.primary + "20" },
              ]}
            >
              <Text
                style={[styles.wotdBadgeText, { color: theme.colors.primary }]}
              >
                WOTD
              </Text>
            </View>
          )}
        </View>

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

        <View style={styles.metaRow}>
          <Text
            style={[styles.favoriteDate, { color: theme.colors.textSecondary }]}
          >
            Added {formatDate(item.dateAdded)}
          </Text>
          <Text
            style={[
              styles.favoriteIndex,
              { color: theme.colors.textSecondary },
            ]}
          >
            #{index + 1}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.removeButton,
          { backgroundColor: theme.colors.primary + "10" },
        ]}
        onPress={() => handleRemoveFavorite(item)}
        activeOpacity={0.7}
      >
        <Ionicons name="heart" size={22} color={theme.colors.primary} />
      </TouchableOpacity>
    </Animated.View>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.border,
    },
    searchContainer: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.border,
    },
    searchInput: {
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
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
            {favorites.length > 1 && (
              <TouchableOpacity
                onPress={handleSortToggle}
                style={styles.sortButton}
              >
                <Ionicons
                  name={sortBy === "recent" ? "time-outline" : "list-outline"}
                  size={20}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.headerMeta}>
            <Text
              style={[
                styles.favoriteCount,
                { color: theme.colors.textSecondary },
              ]}
            >
              {filteredFavorites.length} of {favorites.length} word
              {favorites.length !== 1 ? "s" : ""}
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
        </View>

        {/* Search Bar */}
        {favorites.length > 3 && (
          <View style={[styles.searchContainer, dynamicStyles.searchContainer]}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search-outline"
                size={18}
                color={theme.colors.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, dynamicStyles.searchInput]}
                placeholder="Search favorites..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearSearchButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Content */}
        {filteredFavorites.length === 0 ? (
          <View style={[styles.emptyContainer, dynamicStyles.emptyContainer]}>
            <Ionicons
              name={searchQuery ? "search-outline" : "heart-outline"}
              size={64}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              {searchQuery ? "No matches found" : "No favorites yet"}
            </Text>
            <Text
              style={[
                styles.emptyMessage,
                { color: theme.colors.textSecondary },
              ]}
            >
              {searchQuery
                ? "Try searching for a different word or phrase"
                : "Tap the heart icon on any word to add it to your favorites"}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                style={[
                  styles.clearSearchButtonLarge,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setSearchQuery("")}
              >
                <Text
                  style={[
                    styles.clearSearchButtonLargeText,
                    { color: theme.colors.background },
                  ]}
                >
                  Clear Search
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredFavorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  sortButton: {
    padding: 8,
    marginRight: -8,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteCount: {
    fontSize: 14,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
  },
  clearSearchButton: {
    padding: 4,
    marginLeft: 8,
  },
  listContent: {
    padding: 20,
  },
  favoriteItem: {
    flexDirection: "row",
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  favoriteContent: {
    flex: 1,
    marginRight: 16,
  },
  wordHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  favoriteWord: {
    fontSize: 22,
    fontWeight: "bold",
    marginRight: 8,
  },
  wotdBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  wotdBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  favoritePartOfSpeech: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 10,
  },
  favoriteDefinition: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteDate: {
    fontSize: 12,
  },
  favoriteIndex: {
    fontSize: 12,
    fontWeight: "600",
  },
  removeButton: {
    padding: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    minWidth: 44,
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
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  clearSearchButtonLarge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearSearchButtonLargeText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
