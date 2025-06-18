/**
 * Main styles entry point
 * This file imports all the necessary styles for the application
 */

import { createGlobalStyle } from 'styled-components';
import './LegacyFixes.css';
import './App.css';
import '../components/CarouselDarkMode.css';

const MainStyles = createGlobalStyle`
  /* Base styles */
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Open Sans', sans-serif;
  }

  /* Responsive fixes */
  @media screen and (max-width: 768px) {
    .intro h1 {
      font-size: 40px;
    }
    
    .section-title h2 {
      font-size: 24px;
    }
  }
`;

export default MainStyles;
