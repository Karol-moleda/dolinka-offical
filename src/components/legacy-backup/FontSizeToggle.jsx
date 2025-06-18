// src/components/FontSizeToggle.jsx
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faFont } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  background: transparent;
`;

const FontIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 3px;
  color: #ffffff;
  font-size: 14px;
  text-shadow: 0 0 3px rgba(0,0,0,0.7);

  @media (max-width: 991px) {
    font-size: 16px;
  }
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin: 0 2px;
  border-radius: 50%;
  transition: all 0.2s ease;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    color: #3498db;
  }

  &:focus {
    outline: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 991px) {
    width: 30px;
    height: 30px;
  }
`;

const FontSizeToggle = () => {
  const { fontSize, increaseFontSize, decreaseFontSize } = useTheme();

  return (
    <ToggleContainer>
      <Button 
        onClick={decreaseFontSize} 
        disabled={fontSize <= 12}
        aria-label="Decrease font size"
      >
        <FontAwesomeIcon icon={faMinus} />
      </Button>
      <FontIcon>
        <FontAwesomeIcon icon={faFont} />
      </FontIcon>
      <Button 
        onClick={increaseFontSize} 
        disabled={fontSize >= 24}
        aria-label="Increase font size"
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
    </ToggleContainer>
  );
};

export default FontSizeToggle;