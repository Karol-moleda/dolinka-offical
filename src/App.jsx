// App.jsx
import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import "./App.css";
import Calendar from "./components/calendar";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.backgroundColor} !important;
    color: ${(props) => props.theme.color} !important;
    transition: all 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6, p, a, li, span, div, a {
    color: ${(props) => props.theme.color} !important;
    transition: all 0.3s ease;
  }

  .navbar, .navbar-default, .navbar-brand, .navbar-nav > li > a, #features, #services, #contact, .intro {
    background-color: ${(props) => props.theme.backgroundColor} !important;
    background: ${(props) => props.theme.backgroundColor} !important;
    color: ${(props) => props.theme.color} !important;
    transition: all 0.3s ease;
  }

  .page-scroll {
    transition: all 0.3s ease;
  }
`;

const lightTheme = {

};

const darkTheme = {
  backgroundColor: '#000000',
  color: '#ffffff',
};


const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  const changeFontSize = (newFontSize) => {
    document.body.style.fontSize = `${newFontSize}px`;
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, li, span, div, .navbar, .navbar-default, .navbar-brand, .navbar-nav > li > a, #features, #services, #contact, .intro, .page-scroll');
    elements.forEach(element => {
      element.style.fontSize = `${newFontSize}px`;
    });
  };

  const increaseFontSize = () => {
    changeFontSize(parseInt(getComputedStyle(document.body).fontSize) + 2);
  };

  const decreaseFontSize = () => {
    const currentFontSize = parseInt(getComputedStyle(document.body).fontSize);
    if (currentFontSize > 10) {
      changeFontSize(currentFontSize - 2);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div>
        <Navigation toggleTheme={toggleTheme} increaseFontSize={increaseFontSize} decreaseFontSize={decreaseFontSize} />
        <Header data={landingPageData.Header} />
        <Features data={landingPageData.Features} />
        <About data={landingPageData.About} />
        <Services data={landingPageData.Services} />
        <Gallery data={landingPageData.Gallery} />
        {/* <Testimonials data={landingPageData.Testimonials} /> */}
        <Team data={landingPageData.Team} />
        <Calendar data={landingPageData.Calendar} />
        <Contact data={landingPageData.Contact} />
      </div>
    </ThemeProvider>
  );
};

export default App;