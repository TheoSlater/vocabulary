import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./HomeScreen";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
};

export default App;
