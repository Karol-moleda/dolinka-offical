// Navigation.jsx
import React from "react";
import styled from 'styled-components';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import FontSizeToggle from './FontSizeToggle';  

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

export const Navigation = ({ toggleTheme, increaseFontSize, decreaseFontSize }) => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            Dolinka
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Aktualności
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                O nas
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Wydarzenia
              </a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll">
                Zdjęcia
              </a>
            </li>
            {/* <li>
              <a href="#testimonials" className="page-scroll">
                Opinie
              </a>
            </li> */}
            <li>
              <a href="#team" className="page-scroll">
                Zarząd
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                Kontakt
              </a>
            </li>
            <li>
              <ToggleContainer>
                <Toggle
                  defaultChecked={false}
                  icons={{ checked: "🌙", unchecked: "☀️" }}
                  onChange={toggleTheme}
                />
              </ToggleContainer>
            </li>
            <li>
              <FontSizeToggle increaseFontSize={increaseFontSize} decreaseFontSize={decreaseFontSize} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};