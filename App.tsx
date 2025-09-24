import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./HomeScreen";
import { FavoritesProvider } from "./contexts/FavouritesContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Home />
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default App;
