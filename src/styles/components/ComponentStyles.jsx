/* 
* This file consolidates multiple component-specific CSS fixes
* for gallery, lightbox, navigation, headers, etc. 
*/

import { createGlobalStyle } from 'styled-components';

const ComponentStyles = createGlobalStyle`
  /* Gallery and lightbox fixes */
  .gallery-item {
    position: relative;
    overflow: hidden;
    margin-bottom: 15px;
    cursor: pointer;
  }

  .gallery-item img {
    width: 100%;
    transition: transform 0.3s ease;
  }

  .gallery-item:hover img {
    transform: scale(1.05);
  }

  .lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  /* Navigation contrast fixes */
  body.dark-mode #menu {
    background-color: #000000;
  }

  body.dark-mode #menu.navbar-default .navbar-nav > li > a {
    color: #ffffff;
  }

  body.dark-mode #menu.navbar-default .navbar-nav > li > a:hover {
    color: ${props => props.theme.primary};
  }

  /* Header text visibility improvements */
  .intro h1 {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  /* Contact section contrast enhancements */
  body.dark-mode #contact {
    background: #000000;
  }

  body.dark-mode #contact .section-title h2 {
    color: #ffffff;
  }

  body.dark-mode #contact .contact-item {
    background: #1a1a1a;
  }

  body.dark-mode #contact h3 {
    color: ${props => props.theme.primary};
  }

  /* Services section light/dark mode fixes */
  #services i.fa {
    font-size: 38px;
    margin-bottom: 20px;
    transition: all 0.5s;
    color: #fff;
    width: 100px;
    height: 100px;
    padding: 30px 0;
    border-radius: 50%;
    background: linear-gradient(to right, #6372ff 0%, #5ca9fb 100%);
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.05);
  }

  body.dark-mode #services i.fa {
    background: linear-gradient(to right, #42a5f5 0%, #90caf9 100%);
    color: #000000;
  }

  /* Event card spacing fixes */
  .event-card {
    margin-bottom: 30px;
    padding: 20px;
    border-radius: 5px;
  }

  body.dark-mode .event-card {
    background-color: #1a1a1a;
  }

  .event-card h4 {
    margin-bottom: 15px;
  }

  /* Aerial view text readability fixes */
  .aerial-section {
    position: relative;
  }

  .aerial-section .content {
    position: relative;
    z-index: 2;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 8px;
  }

  body.dark-mode .aerial-section .content {
    background-color: rgba(0, 0, 0, 0.75);
  }
`;

export default ComponentStyles;
