// AccessibilityControls.jsx
import React from 'react';
import styled from 'styled-components';
import FontSizeToggle from './FontSizeToggle';
import ThemeToggle from './themeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';

const AccessibilityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 30px;
  padding: 8px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-left: 20px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 991px) {
    margin: 20px auto 0;
    width: fit-content;
    padding: 10px 20px;
  }
`;

const AccessibilityLabel = styled.span`
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  margin-right: 10px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    font-size: 16px;
  }
  
  @media (max-width: 991px) {
    font-size: 16px;
    
    svg {
      font-size: 18px;
    }
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 991px) {
    gap: 20px;
  }
`;

const Divider = styled.div`
  height: 24px;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.4);
  margin: 0 8px;
  
  @media (max-width: 991px) {
    height: 28px;
    margin: 0 12px;
  }
`;

const TooltipContainer = styled.div`
  position: relative;

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.div`
  visibility: hidden;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s;
  white-space: nowrap;
  font-size: 12px;
  pointer-events: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
`;

const AccessibilityControls = () => {
  return (
    <AccessibilityContainer>
      <AccessibilityLabel>
        <FontAwesomeIcon icon={faUniversalAccess} />
        Dostępność
      </AccessibilityLabel>
      <ControlsGroup>
        <TooltipContainer>
          <FontSizeToggle />
          <Tooltip className="tooltip">Rozmiar tekstu</Tooltip>
        </TooltipContainer>
        <Divider />        <TooltipContainer>
          <ThemeToggle />
          <Tooltip className="tooltip">Wysoki kontrast (czarne tło)</Tooltip>
        </TooltipContainer>
      </ControlsGroup>
    </AccessibilityContainer>
  );
};

export default AccessibilityControls;
