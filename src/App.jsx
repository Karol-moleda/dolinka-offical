// App.jsx
import React, { Suspense, lazy, useState, useEffect } from "react";
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import JsonData from "./data/data.json";

// Import consolidated style files
import GlobalStyles from "./styles/base/GlobalStyles";
import MainStyles from "./styles/base/MainStyles";
import ComponentStyles from "./styles/components/ComponentStyles";

// Import theme context provider
import { ThemeContext, ThemeProvider } from "./context/ThemeContext";// Lazy load main sections for code splitting
const Navigation = lazy(() => import("./components/navigation"));
const Header = lazy(() => import("./components/header"));
const About = lazy(() => import("./components/about"));
const Services = lazy(() => import("./components/services"));
const Features = lazy(() => import("./components/features"));
const Gallery = lazy(() => import("./components/gallery"));
const Team = lazy(() => import("./components/Team"));
const Contact = lazy(() => import("./components/contact"));
const AccessibilityPanel = lazy(() => import("./components/AccessibilityPanel"));

function App() {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme, fontSize }) => (
          <StyledThemeProvider theme={theme}>            <GlobalStyles fontSize={fontSize} />
            <ComponentStyles />
            <MainStyles />            <Suspense fallback={<div style={{textAlign: 'center', marginTop: 100}}>Ładowanie strony...</div>}>
              <div>
                <Navigation />
                <Header data={landingPageData.Header} />
                <Features data={landingPageData.Features} />
                <About data={landingPageData.About} />
                <Services data={landingPageData.Services} />
                <Gallery data={landingPageData.Gallery}/>
                <Team data={landingPageData.Team} />
                <Contact data={landingPageData.Contact} />
                <AccessibilityPanel />
              </div>
            </Suspense>
          </StyledThemeProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}

export default App;