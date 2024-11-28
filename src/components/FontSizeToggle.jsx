// src/components/FontSizeToggle.jsx
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  margin: 0 10px;
  color: ${(props) => props.theme.color};
`;

const FontSizeToggle = ({ increaseFontSize, decreaseFontSize }) => {
  console.log(increaseFontSize, decreaseFontSize);
  return (
    <ToggleContainer>
      <Button onClick={decreaseFontSize} aria-label="Decrease font size">
        <FontAwesomeIcon icon={faMinus} />
      </Button>
      <Button onClick={increaseFontSize} aria-label="Increase font size">
        <FontAwesomeIcon icon={faPlus} />
      </Button>
    </ToggleContainer>
  );
};

export default FontSizeToggle;