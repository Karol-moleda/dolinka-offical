// ThemeToggle.jsx
import React from 'react';
import styled from 'styled-components';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import { useTheme } from '../context/ThemeContext';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  position: relative;

  .react-toggle {
    touch-action: pan-x;
    display: inline-block;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 0;
    user-select: none;
  }
  .react-toggle-track {
    background-color: #f6f6f6;
    border: 2px solid #4D4D4D;
  }

  .react-toggle--checked .react-toggle-track {
    background-color: #121212;
    border: 2px solid #fff;
  }

  .react-toggle-thumb {
    border: 1px solid #4D4D4D;
  }
  
  .react-toggle--checked .react-toggle-thumb {
    border: 1px solid #fff;
  }
  
  .icon-container {
    position: absolute;
    top: 0;
    left: -20px;
    font-size: 20px;
    color: #fff;
    text-shadow: 0 0 3px rgba(0,0,0,0.7);
  }
`;

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleContainer>
      <Toggle
        checked={isDarkMode}
        onChange={toggleTheme}
        icons={{ 
          checked: <span style={{ fontSize: '12px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>🌙</span>, 
          unchecked: <span style={{ fontSize: '12px', color: 'gold', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>☀️</span> 
        }}
        aria-label="Przełącznik kontrastu"
      />
    </ToggleContainer>
  );
};

export default ThemeToggle;