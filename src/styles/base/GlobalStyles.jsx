import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary: ${props => props.theme.primary};
    --primary-hover: ${props => props.theme.primaryHover};
    --font-size-base: ${props => props.fontSize}px;
  }

  * {
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  html {
    font-size: ${props => props.fontSize}px;
  }

  body {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.color};
    font-family: 'Open Sans', sans-serif;
    font-size: ${props => props.fontSize}px;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Raleway', sans-serif;
    font-weight: 700;
    color: ${props => props.theme.headingColor};
  }

  /* Dark mode section styles */
  body.dark-mode section {
    background-color: ${props => props.theme.sectionBackground};
    
    &:nth-child(even) {
      background-color: ${props => props.theme.altSectionBackground};
    }
  }

  /* Container styling for dark mode */
  body.dark-mode .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Section title styling for dark mode */
  body.dark-mode .section-title {
    text-align: center;
    margin-bottom: 60px;

    h2 {
      font-weight: 700;
      color: ${props => props.theme.headingColor};
      margin-bottom: 20px;
    }
    
    p {
      color: ${props => props.theme.color};
    }
  }

  /* Button styling for both modes */
  .btn-custom {
    background: ${props => props.theme.buttonBackground};
    color: ${props => props.theme.buttonColor} !important;
    transition: all 0.3s ease;

    &:hover {
      background: ${props => props.theme.buttonHoverBackground};
    }
  }
  
  /* Card styling for dark mode */
  body.dark-mode .card, 
  body.dark-mode .box, 
  body.dark-mode .portfolio-item, 
  body.dark-mode .team-member {
    background-color: ${props => props.theme.cardBackground};
    color: ${props => props.theme.color};
  }
  
  /* Link styling for both modes */
  a {
    color: ${props => props.theme.linkColor};
    &:hover {
      color: ${props => props.theme.linkHoverColor};
    }
  }
  
  /* Dark mode section-specific styling */
  body.dark-mode #services {
    background: ${props => props.theme.servicesBackground};
    color: ${props => props.theme.servicesTextColor};
  }
  
  body.dark-mode #features {
    background: ${props => props.theme.featuresBackground};
  }
  
  body.dark-mode #team h4 {
    color: ${props => props.theme.teamTitleColor};
  }
`;

export default GlobalStyles;
