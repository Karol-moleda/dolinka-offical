import { useTheme } from '../context/ThemeContext';

// This is a helper component to update component usage from AppContext to ThemeContext
// It provides a common interface for components that need theme and font size

export const useAppContext = () => {
  const { theme, isDarkMode, toggleTheme, fontSize, increaseFontSize, decreaseFontSize } = useTheme();
  
  return {
    theme,
    isDarkMode,
    toggleTheme,
    fontSize,
    increaseFontSize,
    decreaseFontSize
  };
};

export default useAppContext;
