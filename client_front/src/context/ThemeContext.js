import React, { createContext, useState, useContext, useEffect } from "react";

// Créer le contexte du thème
const ThemeContext = createContext();

// Créer le fournisseur de contexte pour gérer le thème
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Charger le mode thème depuis le localStorage au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  // Basculer entre le mode clair et sombre
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        localStorage.setItem("theme", "dark");
        document.body.classList.add("dark-mode");
      } else {
        localStorage.setItem("theme", "light");
        document.body.classList.remove("dark-mode");
      }
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utiliser le contexte dans les composants
export const useTheme = () => {
  return useContext(ThemeContext);
};
