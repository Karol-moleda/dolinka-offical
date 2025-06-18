import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const HeaderContainer = styled.header`
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  background-color: transparent !important; /* Ensure header background is transparent */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('img/Dolinka.jpg') center center/cover no-repeat;
    z-index: -2;
    background-color: transparent !important; /* Preserve image background */
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isDarkMode ? 
      'linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.8) 100%)' : 
      'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)'};
    z-index: -1;
    background-color: transparent !important; /* Preserve gradient overlay */
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: ${props => `calc(${props.fontSize}px * 2)`};
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;

  span {
    color: var(--primary);
  }
`;

const Subtitle = styled(motion.p)`
  font-size: ${props => `calc(${props.fontSize}px * 1.2)`};
  color: #ffffff;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  line-height: 1.6;
`;

const Button = styled(motion.a)`
  display: inline-block;
  padding: 15px 40px;
  font-size: ${props => `${props.fontSize}px`};
  font-weight: 600;
  color: #ffffff;
  background: var(--primary);
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(96, 141, 253, 0.3);
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 1;

  svg {
    width: 30px;
    height: 30px;
    fill: #ffffff;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const Header = () => {
  const { fontSize, isDarkMode } = useTheme();
  
  return (
    <HeaderContainer isDarkMode={isDarkMode}>
      <ContentWrapper>
        <Title
          fontSize={fontSize}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span>DOLINKA</span>
        </Title>
        <Subtitle
          fontSize={fontSize}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Oficjalna strona Zarządu Osiedla Młodych w Olkuszu
        </Subtitle>
        <Button
          fontSize={fontSize}
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          role="button"
          aria-label="Dowiedz się więcej"
        >
          Dowiedz się więcej
        </Button>
      </ContentWrapper>
      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        onClick={() => {
          document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
        }}
        role="button"
        aria-label="Przewiń w dół"
      >
        <svg viewBox="0 0 24 24">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </ScrollIndicator>
    </HeaderContainer>
  );
};

export default Header;
