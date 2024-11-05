// ThemeToggle.jsx
import React from 'react';
import styled from 'styled-components';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThemeToggle = ({ toggleTheme }) => {
  return (
    <ToggleContainer>
      <Toggle
        defaultChecked={false}
        icons={{ checked: "🌙", unchecked: "☀️" }}
        onChange={toggleTheme}
      />
    </ToggleContainer>
  );
};

export default ThemeToggle;