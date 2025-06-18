import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import '../styles/components/ToggleSwitch.css';

const AccessibilityContainer = styled.div`
  position: fixed;
  right: 20px;
  top: 100px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.cardBackground};
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const AccessibilityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.buttonColor};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primaryHover};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

const ToggleLabel = styled.span`
  color: ${props => props.theme.color};
  margin-right: 8px;
  font-size: 14px;
`;

const AccessibilityPanel = () => {
  const { 
    isDarkMode, 
    toggleTheme, 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize 
  } = useTheme();

  return (
    <AccessibilityContainer>
      <ToggleContainer>
        <ToggleLabel>Tryb ciemny:</ToggleLabel>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={isDarkMode} 
            onChange={toggleTheme}
          />
          <span className="slider round"></span>
        </label>
      </ToggleContainer>
      
      <ToggleContainer>
        <ToggleLabel>Rozmiar tekstu: {fontSize}px</ToggleLabel>
      </ToggleContainer>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <AccessibilityButton 
          onClick={decreaseFontSize} 
          disabled={fontSize <= 12}
          style={{ opacity: fontSize <= 12 ? 0.5 : 1 }}
        >
          A-
        </AccessibilityButton>
        
        <AccessibilityButton 
          onClick={increaseFontSize} 
          disabled={fontSize >= 24}
          style={{ opacity: fontSize >= 24 ? 0.5 : 1 }}
        >
          A+
        </AccessibilityButton>
      </div>
    </AccessibilityContainer>
  );
};

export default AccessibilityPanel;
