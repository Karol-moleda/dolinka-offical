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
  padding: 3px;
`;

const AccessibilityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px;
  margin-left: 2px;
  border-left: 1px solid #eee;
  height: 50px;
  overflow: hidden; /* Zapobieganie wyświetlaniu poza kontenerem */
`;

const AccessibilityText = styled.span`
  margin: 0 5px;
  font-size: 11px;
  color: ${(props) => props.theme.color};
  white-space: nowrap;
  writing-mode: horizontal-tb !important; /* Wymuszenie poziomego tekstu */
  text-orientation: mixed !important;
  transform: none !important; /* Usunięcie transformacji */
`;

const DisplayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const NavItem = styled.li`
  a {
    padding-left: 7px !important;
    padding-right: 7px !important;
    font-size: 13px;
    white-space: nowrap;
    letter-spacing: -0.2px;
  }
`;

const NavbarRight = styled.ul`
  display: flex;
  align-items: center;
  margin-right: -15px;
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
          <NavbarRight className="nav navbar-nav navbar-right">
            <NavItem>
              <a href="#features" className="page-scroll">
                Aktualności
              </a>
            </NavItem>
            <NavItem>
              <a href="#about" className="page-scroll">
                O&nbsp;nas
              </a>
            </NavItem>
            <NavItem>
              <a href="#services" className="page-scroll">
                Wydarzenia
              </a>
            </NavItem>
            <NavItem>
              <a href="#portfolio" className="page-scroll">
                Galeria
              </a>
            </NavItem>
            <NavItem>
              <a href="#team" className="page-scroll">
                Zarząd
              </a>
            </NavItem>
            <NavItem>
              <a href="#calendar" className="page-scroll">
                Kalendarz
              </a>
            </NavItem>
            <NavItem>
              <a href="#contact" className="page-scroll">
                Kontakt
              </a>
            </NavItem>
            <li>
              <AccessibilityContainer>
                <AccessibilityText>
                  <strong>Panel dostępności</strong>
                </AccessibilityText>
                <DisplayRow>
                  <ToggleContainer>
                    <Toggle
                      defaultChecked={false}
                      icons={{ checked: "🌙", unchecked: "☀️" }}
                      onChange={toggleTheme}
                      className="small-toggle"
                    />
                  </ToggleContainer>
                  <FontSizeToggle increaseFontSize={increaseFontSize} decreaseFontSize={decreaseFontSize} />
                </DisplayRow>
              </AccessibilityContainer>
            </li>
          </NavbarRight>
        </div>
      </div>
    </nav>
  );
};