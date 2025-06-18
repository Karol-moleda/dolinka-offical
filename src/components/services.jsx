import React from "react";
import "./services.css";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

const ServicesContainer = styled.div`
  /* The background is set by CSS, we don't need to change it here */
  .section-title {
    h2 {
      font-size: calc(${(props) => props.fontSize}px * 1.5);
      color: #ffffff !important; /* Always white for better visibility on blue gradient */
      text-shadow: ${(props) => (props.isDarkMode ? "2px 2px 4px rgba(0, 0, 0, 0.7)" : "3px 3px 6px rgba(0, 0, 0, 0.8)")};
      font-weight: ${(props) => (props.isDarkMode ? "700" : "800")};
      letter-spacing: 0.7px; /* Better letter spacing for readability */
    }
    p {
      font-size: calc(${(props) => props.fontSize}px * 1.1);
      color: #ffffff !important; /* Always white for better visibility on blue gradient */
      text-shadow: ${(props) => (props.isDarkMode ? "1px 1px 3px rgba(0, 0, 0, 0.7)" : "2px 2px 4px rgba(0, 0, 0, 0.7)")};
      font-weight: ${(props) => (props.isDarkMode ? "500" : "600")};
      line-height: 1.7;
    }
  }
  .service-desc {
    background-color: ${(props) => (props.isDarkMode ? "#1a1a1a" : "rgba(255, 255, 255, 0.97)")};
    border: 1px solid ${(props) => (props.isDarkMode ? "#333" : "rgba(220, 220, 220, 0.9)")};
    box-shadow: ${(props) => (props.isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.35)")};
    border-radius: 5px;

    h3 {
      font-size: calc(${(props) => props.fontSize}px * 1.2);
      color: ${(props) => (props.isDarkMode ? "#ffffff" : "#1a2a3a")};
      font-weight: ${(props) => (props.isDarkMode ? "600" : "700")};
      margin-bottom: 10px;
    }
    p {
      font-size: inherit;
      color: ${(props) => (props.isDarkMode ? "#ffffff" : "#333333")};
      font-weight: ${(props) => (props.isDarkMode ? "normal" : "500")};
      line-height: 1.6;
    }
  }
`;

export const Services = (props) => {
  const { fontSize, isDarkMode } = useTheme();

  return (
    <ServicesContainer
      fontSize={fontSize}
      isDarkMode={isDarkMode}
      id="services"
      className="text-center"
    >
      <div className="container">
        <div className="section-title">
          <h2>Nasze Wydarzenia</h2>
          <p>
            Jako Zarząd Osiedla Młodych organizujemy liczne wydarzenia, które
            mają na celu łączyć pokolenia – zarówno starszych, jak i młodszych
            mieszkańców. Tworzymy okazje do wspólnej zabawy, integracji i
            budowania więzi sąsiedzkich, by nasze osiedle tętniło życiem i było
            miejscem przyjaznym dla wszystkich!
          </p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4 col-sm-6">
                  <div className="service-item">
                    <img
                      src={process.env.PUBLIC_URL + "/" + d.img}
                      alt={d.name}
                      className="service-img img-responsive"
                    />
                    <div className="service-desc">
                      <h3>{d.name}</h3>
                      <p>{d.text}</p>
                    </div>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </ServicesContainer>
  );
};

export default Services;
