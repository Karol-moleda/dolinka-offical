// App.jsx
import React, { useState, useEffect, createContext, Suspense, lazy } from "react";
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import "./App.css";
// Import restore original styling (restores original look while keeping dark mode feature)
import "./restore-original-styling.css";
// Import CSS to ensure original colorful backgrounds
import "./colorful-original.css";
// Import gallery and lightbox fixes
import "./gallery-lightbox-fix.css";
// Import final fixes
import "./final-fixes.css";
// Import contact section specific fixes
import "./contact-contrast-fix.css";
// Import enhanced contrast for contact section
import "./contact-enhanced-contrast.css";
// Import services section contrast fix
import "./services-contrast-fix.css";
// Import services light mode fix
import "./services-light-mode-fix.css";
// Import aerial view text fix
import "./aerial-view-fix.css";
// Import navigation contrast fix for aerial background
import "./nav-contrast-fix.css";
// Import event card fix for proper text spacing
import "./event-card-fix.css";
import JsonData from "./data/data.json";

// Theme context
export const AppContext = createContext();

// Theme definitions - Fully preserve original look in light mode, high contrast in dark mode
const themes = {
  light: {
    primary: '#608dfd',
    primaryHover: '#4a6fd7',
    backgroundColor: 'transparent',  // Transparent to preserve original backgrounds
    color: '#777',  // Original text color
    headingColor: '#333',  // Original heading color
    sectionBackground: 'transparent', // Transparent to preserve original section backgrounds
    altSectionBackground: 'transparent', // Transparent to preserve original alternating sections
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
    // Specific section colors for light mode
    servicesBackground: 'linear-gradient(to right, #6372ff 0%, #5ca9fb 100%)',
    servicesTextColor: '#ffffff',
    featuresBackground: '#f6f6f6',
    teamTitleColor: '#1565C0'
  },
  dark: {
    primary: '#90caf9',
    primaryHover: '#42a5f5',
    backgroundColor: '#000000', // Pure black background for maximum contrast
    color: '#ffffff', // White text for maximum contrast
    headingColor: '#ffffff',
    sectionBackground: '#000000', // Black background for maximum contrast
    altSectionBackground: '#121212', // Very dark gray for alternating sections
    cardBackground: '#1a1a1a', // Dark card background
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
    // Specific section colors for dark mode
    servicesBackground: '#000000',
    servicesTextColor: '#ffffff',
    featuresBackground: '#000000',
    teamTitleColor: '#90caf9'
  }
};

// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: ${props => props.theme.primary};
    --primary-hover: ${props => props.theme.primaryHover};
    --font-size-base: ${props => props.fontSize}px;
  }

  * {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  html {
    font-size: ${props => props.fontSize}px;
  }

  body {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.color};
    font-family: 'Open Sans', sans-serif;
    font-size: ${props => props.fontSize}px;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Raleway', sans-serif;
    font-weight: 700;
    color: ${props => props.theme.headingColor};
  }

  /* Don't use global overrides for sections, let original CSS work in light mode */
  body.dark-mode section {
    background-color: ${props => props.theme.sectionBackground};
    
    &:nth-child(even) {
      background-color: ${props => props.theme.altSectionBackground};
    }
  }

  /* Only apply container styling for dark mode */
  body.dark-mode .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Only style section titles in dark mode */
  body.dark-mode .section-title {
    text-align: center;
    margin-bottom: 60px;

    h2 {
      font-weight: 700;
      color: ${props => props.theme.headingColor};
      margin-bottom: 20px;
    }
    
    p {
      color: ${props => props.theme.color};
    }
  }

  /* Button styling for both modes */
  .btn-custom {
    background: ${props => props.theme.buttonBackground};
    color: ${props => props.theme.buttonColor} !important;
    transition: all 0.3s ease;

    &:hover {
      background: ${props => props.theme.buttonHoverBackground};
    }
  }
  
  /* Card styling only for dark mode */
  body.dark-mode .card, 
  body.dark-mode .box, 
  body.dark-mode .portfolio-item, 
  body.dark-mode .team-member {
    background-color: ${props => props.theme.cardBackground};
    color: ${props => props.theme.color};
  }
  
  /* Link styling for both modes */
  a {
    color: ${props => props.theme.linkColor};
    &:hover {
      color: ${props => props.theme.linkHoverColor};
    }
  }
  
  /* Apply dark mode to services section */
  body.dark-mode #services {
    background: ${props => props.theme.servicesBackground};
    color: ${props => props.theme.servicesTextColor};
  }
  
  /* Apply dark mode to features section */
  body.dark-mode #features {
    background: ${props => props.theme.featuresBackground};
  }
  
  /* Team titles in dark mode */
  body.dark-mode #team h4 {
    color: ${props => props.theme.teamTitleColor};
  }
`;

// Loading component removed as it was not being used

// Lazy load main sections for code splitting
const Navigation = lazy(() => import("./components/navigation"));
const Header = lazy(() => import("./components/header"));
const About = lazy(() => import("./components/about"));
const Services = lazy(() => import("./components/services"));
const Features = lazy(() => import("./components/features"));
const Gallery = lazy(() => import("./components/gallery"));
const Team = lazy(() => import("./components/Team"));
const Contact = lazy(() => import("./components/contact"));

function App() {
  const [landingPageData, setLandingPageData] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default font size

  useEffect(() => {
    setLandingPageData(JsonData);
    
    // Load saved preferences from localStorage if available
    const savedTheme = localStorage.getItem('dolinka-theme');
    const savedFontSize = localStorage.getItem('dolinka-font-size');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }
  }, []);

  // Effect to update body class when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    localStorage.setItem('dolinka-theme', newThemeValue ? 'dark' : 'light');
  };
  
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
  };  return (
    <ThemeProvider theme={themes[isDarkMode ? 'dark' : 'light']}>
      <AppContext.Provider value={{ 
        isDarkMode, 
        toggleTheme,
        fontSize,
        increaseFontSize,
        decreaseFontSize
      }}>
        <GlobalStyle fontSize={fontSize} />
        <Suspense fallback={<div style={{textAlign: 'center', marginTop: 100}}>Ładowanie strony...</div>}>
          <div>
            <Navigation />
            <Header data={landingPageData.Header} />
            <Features data={landingPageData.Features} />
            <About data={landingPageData.About} />
            <Services data={landingPageData.Services} />
            <Gallery data={landingPageData.Gallery}/>
            <Team data={landingPageData.Team} />
            <Contact data={landingPageData.Contact} />
          </div>
        </Suspense>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;