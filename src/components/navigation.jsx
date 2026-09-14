// Navigation.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: ${props => props.$isScrolled 
    ? (props.$isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)') 
    : (props.$isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.4)')  /* Darker background for better visibility */
  };
  padding: ${props => props.$isScrolled ? '15px 0' : '20px 0'};
  transition: all 0.5s ease;
  backdrop-filter: blur(10px);
  box-shadow: ${props => props.$isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  /* Add className for easier CSS targeting */
  &.scrolled {
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Brand = styled.a`
  font-family: 'Raleway', sans-serif;
  font-size: 24px;
  color: ${props => props.$isDarkMode 
    ? '#fff' 
    : props.$isScrolled ? '#333' : '#fff'}; /* White text when not scrolled for better visibility */
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  text-shadow: ${props => props.$isScrolled ? 'none' : '1px 1px 3px rgba(0, 0, 0, 0.8)'}; /* Text shadow when not scrolled */

  &:hover {
    color: #3498db;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.$isDarkMode ? '#fff' : '#333'};
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 991px) {
    display: block;
  }
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 991px) {
    position: fixed;
    top: 0;
    right: ${props => props.$isOpen ? '0' : '-300px'};
    /* Na waskich telefonach 300px to juz prawie caly ekran. */
    width: min(300px, 85vw);
    height: 100vh;
    /* dvh uwzglednia pasek adresu przegladarki mobilnej - bez tego dolne
       pozycje menu potrafia schowac sie pod paskiem. */
    height: 100dvh;
    background: ${props => props.$isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    flex-direction: column;
    padding: 80px 30px;
    transition: right 0.3s ease;
    backdrop-filter: blur(10px);
    overflow-y: auto;
    z-index: 2;
  }
`;

// Przycienione tlo za otwartym menu. Pelni dwie role: oddziela menu od
// tresci i daje najbardziej naturalny sposob zamkniecia - tapniecie obok.
const Backdrop = styled.div`
  display: none;

  @media (max-width: 991px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    opacity: ${props => props.$isOpen ? '1' : '0'};
    /* visibility zamiast display, zeby zostalo przejscie opacity. */
    visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 1;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
  align-items: center;
  height: 100%;

  @media (max-width: 991px) {
    flex-direction: column;
    width: 100%;
    text-align: center;
    align-items: center;
  }
`;

const NavItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLink = styled.a`
  color: ${props => props.$isDarkMode 
    ? '#fff' 
    : props.$isScrolled ? '#333' : '#fff'}; /* White text when not scrolled for better visibility */
  text-decoration: none;
  font-size: inherit;
  font-weight: ${props => props.$isScrolled ? '500' : '600'}; /* Bolder text when not scrolled */
  padding: 5px 0;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  text-shadow: ${props => props.$isScrolled ? 'none' : '1px 1px 2px rgba(0, 0, 0, 0.7)'}; /* Text shadow when not scrolled */

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: #3498db;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #3498db;
    &:after {
      width: 100%;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: ${props => props.$isDarkMode ? '#fff' : '#333'};
  font-size: 24px;
  cursor: pointer;
  display: none;

  @media (max-width: 991px) {
    display: block;
  }
`;

// Pozycje menu trzymane w jednym miejscu - dodanie sekcji to jedna linijka,
// a nie kopiowanie osmiu atrybutow.
const POZYCJE = [
  { href: '#features', label: 'Wydarzenia' },
  { href: '#about', label: 'O nas' },
  { href: '#calendar', label: 'Kalendarz' },
  { href: '#services', label: 'Nasze działania' },
  { href: '#team', label: 'Zarząd' },
  { href: '#portfolio', label: 'Galeria' },
  { href: '#inne', label: 'Dokumenty' },
  { href: '#contact', label: 'Kontakt' },
];

const Navigation = () => {
  const { isDarkMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen((open) => !open);
  const closeMenu = () => setIsOpen(false);

  // Escape zamyka menu - tego oczekuje kazdy, kto korzysta z klawiatury.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Przy otwartym menu strona pod spodem nie moze sie przewijac.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  return (
    <Nav $isScrolled={isScrolled} $isDarkMode={isDarkMode} className={isScrolled ? 'scrolled' : ''}>
      <Container>
        <Brand href="#page-top" onClick={closeMenu} $isDarkMode={isDarkMode} $isScrolled={isScrolled}>Dolinka</Brand>
        <MenuButton onClick={toggleMenu} $isDarkMode={isDarkMode} aria-expanded={isOpen} aria-label="Otwórz menu">
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>

        <Backdrop $isOpen={isOpen} onClick={closeMenu} aria-hidden="true" />

        <NavMenu $isOpen={isOpen} $isDarkMode={isDarkMode}>
          <CloseButton onClick={closeMenu} $isDarkMode={isDarkMode} aria-label="Zamknij menu">
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
          <NavList>
            {POZYCJE.map((pozycja) => (
              <NavItem key={pozycja.href}>
                {/* To jest sedno poprawki: klikniecie pozycji przenosi do
                    sekcji I zamyka menu. Wczesniej menu zostawalo otwarte
                    i zaslanialo to, do czego wlasnie przeszlismy. */}
                <NavLink
                  href={pozycja.href}
                  onClick={closeMenu}
                  $isDarkMode={isDarkMode}
                  $isScrolled={isScrolled}
                >
                  {pozycja.label}
                </NavLink>
              </NavItem>
            ))}
          </NavList>
        </NavMenu>
      </Container>
    </Nav>
  );
};

export default Navigation;