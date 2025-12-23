import React from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './features.css';
import './event-image-fix.css'; // Import the event image fix CSS
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';

const FeaturesContainer = styled.div`
  background-color: ${props => props.isDarkMode ? '#000000' : '#ffffff'};
  transition: all 0.3s ease;
  
  .section-title h2 {
    font-size: calc(${props => props.fontSize}px * 1.5);
    color: ${props => props.isDarkMode ? '#ffffff' : '#2c3e50'};
  }
  
  .section-title p {
    font-size: inherit;
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  }
    .carousel-container {
    position: relative;
    padding-bottom: 80px;  /* Zwiększona wartość dla większego odstępu na kropki */
    min-height: 500px;     /* Minimalna wysokość kontenera */
    background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    border-radius: 12px;
    overflow: visible;     /* Pozwala kropkom być widocznymi poza kontenerem */
    box-shadow: ${props => props.isDarkMode ? '0 0 20px rgba(255, 255, 255, 0.1)' : '0 0 20px rgba(0, 0, 0, 0.1)'};
    transition: all 0.3s ease;
  }
  
  .text-box {
    background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    border: 1px solid ${props => props.isDarkMode ? '#333' : '#e9ecef'};
    margin-bottom: 10px !important;
  }
  
  .text-box h3 {
    font-size: calc(${props => props.fontSize}px * 1.3);
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  }
  
  .text-box p {
    font-size: inherit;
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  }
  
  .carousel .control-dots .dot {
    background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} !important;
  }
  
  .carousel .control-dots .dot.selected {
    background: ${props => props.isDarkMode ? '#ffffff' : '#608dfd'} !important;
  }
  
  /* Dodatkowe style dla stabilnej pozycji kropek */
  .carousel .control-dots {
    position: absolute !important;
    bottom: -20px !important;  /* Przenieś kropki poza kontener */
    left: 50% !important;
    transform: translateX(-50%) !important;
    margin: 0 !important;
    padding: 15px 0 !important;
    background: transparent !important;
    width: auto !important;
    z-index: 10 !important;
  }
`;

const Features = ({ data }) => {
  const { fontSize, isDarkMode } = useTheme();
  
  if (!data) return <div>Ładowanie...</div>;
  
  return (
    <FeaturesContainer fontSize={fontSize} isDarkMode={isDarkMode} id="features" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>AKTUALNOŚCI</h2>
          <p>Najnowsze wydarzenia i inicjatywy w naszej społeczności</p>
        </div>
        <div className="carousel-container">
          <div className="carousel-wrapper">
            <Carousel
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={5000}
              stopOnHover={true}
              emulateTouch={true}
              swipeable={true}
              className={`${isDarkMode ? 'dark-carousel' : 'light-carousel'} carousel-with-spacing`}
            >
              {data.map((item, i) => (
                <div key={`${item.title}-${i}`} className="slide-item">
                  <div className="event-content">
                    <div className="image-container">
                      <img src={item.img} alt={item.title} />
                    </div>
                    <div className="text-box">
                      <h3>{item.title}</h3>
                      <p>
                        {item.text.split('\n').map((line, idx, arr) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </FeaturesContainer>
  );
};

export default Features;