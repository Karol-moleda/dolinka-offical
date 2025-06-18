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
          <div className="col-md-8">
            <div className="row">
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
              <div className="section-title">
                <h2>Telefony</h2>
                <p>
                  <i className="fa fa-phone"></i> <span>32 6260100</span> - Urząd Miasta w
                  Olkuszu <br />
                  <i className="fa fa-phone emergency-phone"></i> <span className="emergency-number">112</span> - numer służy do
                  powiadamiania w sytuacjach zagrożenia zdrowia, życia lub mienia
                  <br />
                  <i className="fa fa-phone emergency-phone"></i> <span className="emergency-number">999</span> - Pogotowie Ratunkowe <br />
                  <i className="fa fa-phone emergency-phone"></i> <span className="emergency-number">998</span> - Straż Pożarna <br />
                  <i className="fa fa-phone emergency-phone"></i> <span className="emergency-number">997</span> - Policja <br />
                  <i className="fa fa-phone"></i> <span>986</span> - Straż Miejska <br />
                </p>
              </div>
              <div className="section-title">
                <h2>Strony</h2>
                <p>
                  <a
                    href="https://umig.olkusz.pl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    Urząd miasta
                  </a>{" "}
                  <br />
                  <a
                    href="https://www.sp.olkusz.pl/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    Starostwo Powiatowe
                  </a>{" "}
                  <br />
                  <a
                    href="http://www.osm.olkusz.pl//"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    Olkuska Spóldzielnia mieszkaniowa
                  </a>{" "}
                  <br />
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-md-offset-1 contact-info">
            <div className="contact-item">
              <h3>Informacje kontaktowe</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Adres
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Przewodniczacy Osiedla Młodych -
                  789 595 848
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
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
