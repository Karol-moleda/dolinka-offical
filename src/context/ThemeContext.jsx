import React, { createContext, useState, useEffect, useContext } from 'react';

// Theme definitions
export const themes = {
  light: {
    primary: '#608dfd',
    primaryHover: '#4a6fd7',
    backgroundColor: 'transparent',
    color: '#777',
    headingColor: '#333',
    sectionBackground: 'transparent',
    altSectionBackground: 'transparent',
    cardBackground: '#ffffff',
    buttonBackground: '#608dfd',
    buttonColor: '#ffffff',
    buttonHoverBackground: '#4a6fd7',
    navbarBackground: '#ffffff',
    navbarTextColor: '#555',
    linkColor: '#608dfd',
    linkHoverColor: '#4a6fd7',
    borderColor: '#e9ecef',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    servicesBackground: 'linear-gradient(to right, #6372ff 0%, #5ca9fb 100%)',
    servicesTextColor: '#ffffff',
    featuresBackground: '#f6f6f6',
    teamTitleColor: '#1565C0'
  },
  dark: {
    primary: '#90caf9',
    primaryHover: '#42a5f5',
    backgroundColor: '#000000',
    color: '#ffffff',
    headingColor: '#ffffff',
    sectionBackground: '#000000',
    altSectionBackground: '#121212',
    cardBackground: '#1a1a1a',
    buttonBackground: '#90caf9',
    buttonColor: '#000000',
    buttonHoverBackground: '#42a5f5',
    navbarBackground: '#000000',
    navbarTextColor: '#ffffff',
    linkColor: '#90caf9',
    linkHoverColor: '#42a5f5',
    borderColor: '#404040',
    boxShadow: '0 2px 15px rgba(0,0,0,0.2)',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    servicesBackground: '#000000',
    servicesTextColor: '#ffffff',
    featuresBackground: '#000000',
    teamTitleColor: '#90caf9'
  }
};

// Create the theme context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  
  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('dolinka-theme');
    const savedFontSize = localStorage.getItem('dolinka-font-size');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }
  }, []);

  // Update body class when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  
  // Theme toggle function
  const toggleTheme = () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    localStorage.setItem('dolinka-theme', newThemeValue ? 'dark' : 'light');
  };
  
  // Font size adjustment functions
  const increaseFontSize = () => {
    if (fontSize < 24) {
      const newSize = fontSize + 2;
      setFontSize(newSize);
      localStorage.setItem('dolinka-font-size', newSize.toString());
    }
  };
  
  const decreaseFontSize = () => {
    if (fontSize > 12) {
      const newSize = fontSize - 2;
      setFontSize(newSize);
      localStorage.setItem('dolinka-font-size', newSize.toString());
    }
  };
  
  // Get current theme object
  const theme = isDarkMode ? themes.dark : themes.light;
  
  return (
    <ThemeContext.Provider value={{
      theme,
      isDarkMode,
      toggleTheme,
      fontSize,
      increaseFontSize,
      decreaseFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
