import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    // Default to dark mode (return true unless explicitly set to light)
    if (savedTheme === null || savedTheme === undefined) {
      // First time user - set dark mode as default
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark-mode');
      return true;
    }
    // Apply saved theme immediately
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Apply theme to document root
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
