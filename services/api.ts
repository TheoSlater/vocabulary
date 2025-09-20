import randomWords from "../data/randomWords.json";

// Wordnik WOTD
export const getWordOfTheDay = async () => {
  try {
    const apiKey = "ogg81z5wuy7tyludpjuqnrsm4icqp8ic3x4re91phta8npand"; // TODO: Put in ENV!!!!
    const response = await fetch(
      `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`
    );
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
  // Shuffle and slice
  const shuffled = [...randomWords.words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Definitions via Free Dictionary API
export const getWordDefinition = async (word: string) => {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) throw new Error("Word not found");
    const data = await response.json();

    const firstMeaning = data[0]?.meanings?.[0];
    return {
      word: data[0].word,
      definition:
        firstMeaning?.definitions?.[0]?.definition || "No definition found.",
      partOfSpeech: firstMeaning?.partOfSpeech || "unknown",
    };
  } catch (error) {
    console.warn(`No definition found for ${word}`);
    return null;
  }
};
