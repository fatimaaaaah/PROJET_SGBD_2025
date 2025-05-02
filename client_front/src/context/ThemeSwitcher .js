import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
    </button>
  );
};

export default ThemeSwitcher;
