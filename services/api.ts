import randomWords from "../data/randomWords.json";

// Move this to environment variables
const WORDNIK_API_KEY = "ogg81z5wuy7tyludpjuqnrsm4icqp8ic3x4re91phta8npand";

export interface WordDefinition {
  word: string;
  definition: string;
  partOfSpeech: string;
  isWordOfDay?: boolean;
}

// Wordnik WOTD
export const getWordOfTheDay = async (): Promise<WordDefinition> => {
  try {
    const response = await fetch(
      `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${WORDNIK_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      word: data.word,
      definition: data.definitions?.[0]?.text || "No definition available.",
      partOfSpeech: data.definitions?.[0]?.partOfSpeech || "unknown",
      isWordOfDay: true,
    };
  } catch (error) {
    console.error("Error fetching Word of the Day:", error);
    return {
      word: "Unavailable",
      definition: "Could not fetch Word of the Day.",
      partOfSpeech: "unknown",
      isWordOfDay: true,
    };
  }
};

// Random words from JSON
export const getRandomWords = async (count: number): Promise<string[]> => {
  if (!randomWords?.words || !Array.isArray(randomWords.words)) {
    console.error("Invalid random words data");
    return [];
  }

  // Fisher-Yates shuffle for better randomization
  const shuffled = [...randomWords.words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Definitions via Free Dictionary API
export const getWordDefinition = async (
  word: string
): Promise<WordDefinition | null> => {
  if (!word || typeof word !== "string") {
    console.warn("Invalid word provided to getWordDefinition");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.[0]?.meanings?.[0]) {
      throw new Error("Invalid API response structure");
    }

    const firstMeaning = data[0].meanings[0];
    const definition = firstMeaning.definitions?.[0]?.definition;

    if (!definition) {
      throw new Error("No definition found in response");
    }

    return {
      word: data[0].word,
      definition,
      partOfSpeech: firstMeaning.partOfSpeech || "unknown",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`No definition found for "${word}":`, error.message);
    } else {
      console.warn(`No definition found for "${word}":`, error);
    }
    return null;
  }
};
