import React from "react";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

const AboutSection = styled.section`
  padding: 100px 0;
  background-color: ${(props) =>
    props.isDarkMode ? "#000000" : "transparent"};

  img {
    margin-top: 20px;
    border-radius: 8px;
    box-shadow: ${(props) => props.theme.boxShadow};
  }
`;

const AboutText = styled.div`
  h2 {
    margin-bottom: 30px;
    font-size: calc(${(props) => props.fontSize}px * 1.5);
    color: ${(props) =>
      props.isDarkMode ? "#ffffff" : props.theme.headingColor};
  }

  p {
    line-height: 1.8;
    margin-bottom: 20px;
    font-size: inherit;
    color: ${(props) => (props.isDarkMode ? "#ffffff" : props.theme.color)};
  }

  ul {
    margin-top: 20px;
    padding-left: 20px;

    li {
      margin-bottom: 10px;
      line-height: 1.6;
      font-size: inherit;
      color: ${(props) => (props.isDarkMode ? "#ffffff" : props.theme.color)};
    }
  }
`;

function About(props) {
  const { fontSize, isDarkMode } = useTheme();

  const darkModeStyle = {
    backgroundColor: isDarkMode ? "#000000" : "inherit",
    color: isDarkMode ? "#ffffff" : "inherit",
  };

  return (
    <AboutSection id="about" isDarkMode={isDarkMode} style={darkModeStyle}>
      <div className="container" style={darkModeStyle}>
        <div className="row" style={darkModeStyle}>
          <div className="col-xs-12 col-md-6" style={darkModeStyle}>
            <img src="img/zarzad.jpg" className="img-responsive" alt="zarząd" />
          </div>
          <div className="col-xs-12 col-md-6" style={darkModeStyle}>
            <AboutText fontSize={fontSize} isDarkMode={isDarkMode} style={darkModeStyle}>
              <h2>O nas</h2>
              {props.data ? (
                <div>
                  <p>{props.data.paragraph}</p>
                  <ul>
                    {props.data.Why.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>Ładowanie...</div>
              )}
            </AboutText>
          </div>
        </div>
      </div>
    </AboutSection>
  );
}

export default About;
