import React, { useContext } from "react";
import "./contact.css";
import styled from "styled-components";
import { AppContext } from "../App";

const ContactContainer = styled.div`
  #contact {
    background: ${(props) => 
      props.isDarkMode 
        ? "#000000 !important" 
        : "linear-gradient(to right, #4e54c8, #8f94fb) !important"};

    .section-title h2 {
      font-size: calc(${(props) => props.fontSize}px * 1.5);
      color: #ffffff !important;
      text-shadow: ${(props) => 
        props.isDarkMode 
          ? "1px 1px 3px rgba(0, 0, 0, 0.8)" 
          : "2px 2px 4px rgba(0, 0, 0, 0.2)"};
    }

    .section-title p,
    .contact-item p,
    .contact-item span,
    .form-group label,
    button.btn {
      font-size: inherit;
      color: #ffffff !important;
      text-shadow: ${(props) => 
        props.isDarkMode 
          ? "1px 1px 3px rgba(0, 0, 0, 0.8)" 
          : "1px 1px 2px rgba(0, 0, 0, 0.1)"};
    }

    a {
      color: ${(props) => (props.isDarkMode ? "#90caf9 !important" : "#ffffff !important")};
      &:hover {
        color: ${(props) => (props.isDarkMode ? "#42a5f5 !important" : "#ffd700 !important")};
      }
    }

    .form-group input,
    .form-group textarea {
      font-size: inherit;
      background-color: ${(props) =>
        props.isDarkMode ? "#1a1a1a" : "rgba(255, 255, 255, 0.2)"};
      color: ${(props) => (props.isDarkMode ? "#ffffff" : "#ffffff")};
      border: 1px solid ${(props) => (props.isDarkMode ? "#333" : "rgba(255, 255, 255, 0.3)")};
    }

    .contact-item {
      background-color: ${(props) => 
        props.isDarkMode 
          ? "rgba(26, 26, 26, 0.95)" 
          : "rgba(255, 255, 255, 0.1)"};
      border: 1px solid ${(props) => 
        props.isDarkMode 
          ? "#333" 
          : "rgba(255, 255, 255, 0.2)"};
      backdrop-filter: blur(10px);
    }

    .contact-info i {
      color: ${(props) => (props.isDarkMode ? "#90caf9" : "#ffd700")};
    }
  }
`;

export const Contact = (props) => {
  const { fontSize, isDarkMode } = useContext(AppContext);
  return (
    <ContactContainer fontSize={fontSize} isDarkMode={isDarkMode}>
      <div id="contact" className={isDarkMode ? "dark-contact" : "light-contact"}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h2>Kontakt</h2>
                <p>
                  Jeśli masz ochotę spotkać się, porozmawiać, podzielić się swoimi
                  pomysłami lub po prostu lepiej nas poznać – serdecznie zapraszamy
                  do kontaktu! Jesteśmy otwarci na wszelkie sugestie, pytania i
                  inicjatywy. Razem możemy tworzyć jeszcze lepsze miejsce do
                  życia, więc nie wahaj się do nas zgłosić!
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="contact-info">
                <h3>Telefony</h3>
                <div className="contact-item">
                  <span><i className="fa fa-phone"></i> 32 6260100</span>
                  <p>Urząd Miasta w Olkuszu</p>
                </div>
                <div className="contact-item">
                  <span><i className="fa fa-phone emergency-phone"></i> 112</span>
                  <p>numer służy do powiadamiania w sytuacjach zagrożenia zdrowia, życia lub mienia</p>
                </div>
                <div className="contact-item">
                  <span><i className="fa fa-phone emergency-phone"></i> 999</span>
                  <p>Pogotowie Ratunkowe</p>
                </div>
                <div className="contact-item">
                  <span><i className="fa fa-phone emergency-phone"></i> 998</span>
                  <p>Straż Pożarna</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-info">
                <h3>Strony</h3>
                <div className="contact-item">
                  <a href="https://umig.olkusz.pl/" target="_blank" rel="noopener noreferrer" className="external-link">
                    Urząd miasta
                  </a>
                </div>
                <div className="contact-item">
                  <a href="https://www.sp.olkusz.pl/" target="_blank" rel="noopener noreferrer" className="external-link">
                    Starostwo Powiatowe
                  </a>
                </div>
                <div className="contact-item">
                  <a href="http://www.osm.olkusz.pl//" target="_blank" rel="noopener noreferrer" className="external-link">
                    Olkuska Spóldzielnia mieszkaniowa
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-info">
                <h3>Informacje kontaktowe</h3>
                <div className="contact-item">
                  <span><i className="fa fa-map-marker"></i> Adres</span>
                  <p>Osiedla Młodych, 32-300 Olkusz</p>
                </div>
                <div className="contact-item">
                  <span><i className="fa fa-phone"></i> Przewodniczący Osiedla Młodych</span>
                  <p>789 595 848</p>
                </div>
                <div className="contact-item">
                  <span><i className="fa fa-envelope-o"></i> Email</span>
                  <p>dolinka.olkusz@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"} className="social-link">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContactContainer>
  );
};

export default Contact;
