import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import '../styles/components/ToggleSwitch.css';

const AccessibilityContainer = styled.div`
  position: fixed;
  right: 16px;
  top: ${props => props.isCollapsed ? 'auto' : '88px'};
  bottom: ${props => props.isCollapsed ? '16px' : 'auto'};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.cardBackground};
  padding: ${props => props.isCollapsed ? '8px' : '16px'};
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
  width: ${props => props.isCollapsed ? 'auto' : '240px'};
  max-width: calc(100vw - 24px);
  
  &:hover {
    box-shadow: 0 12px 34px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    right: 12px;
    bottom: 12px;
    top: auto;
    width: ${props => props.isCollapsed ? 'auto' : 'min(92vw, 320px)'};
    max-height: ${props => props.isCollapsed ? 'none' : '80vh'};
    overflow-y: ${props => props.isCollapsed ? 'visible' : 'auto'};
    padding: ${props => props.isCollapsed ? '6px' : '14px'};
  }
`;

const AccessibilityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.buttonColor};
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  min-width: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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

const PanelTitle = styled.h3`
  color: ${props => props.theme.headingColor};
  margin: 0 0 12px;
  padding-bottom: 8px;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  width: 100%;
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.buttonColor};
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: scale(1.1);
  }
`;

const CollapsedIcon = styled.div`
  background: ${props => props.theme.primary};
  color: ${props => props.theme.buttonColor};
  border-radius: 999px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primaryHover};
    transform: scale(1.1);
  }
`;

const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const AccessibilityPanel = () => {
  const { 
    isDarkMode, 
    toggleTheme, 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize 
  } = useTheme();
  
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isCollapsed) {
    return (
      <AccessibilityContainer 
        isDarkMode={isDarkMode} 
        isCollapsed={true}
      >
        <CollapsedIcon onClick={toggleCollapse}>
          ⚙️
        </CollapsedIcon>
      </AccessibilityContainer>
    );
  }

  return (
    <AccessibilityContainer isDarkMode={isDarkMode} isCollapsed={false}>
      <CollapseButton onClick={toggleCollapse}>
        ×
      </CollapseButton>
      <PanelTitle isDarkMode={isDarkMode}>Ułatwienia</PanelTitle>
      <PanelBody>
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
      </PanelBody>
    </AccessibilityContainer>
  );
};

export default AccessibilityPanel;
