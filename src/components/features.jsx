import React from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './features.css';
import './event-image-fix.css'; // Import the event image fix CSS
import { useTheme } from '../context/ThemeContext';
import aktualnosci from "../content/aktualnosci.json";
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

// Spacje i polskie znaki w nazwach plikow musza byc zakodowane,
// ale ukosniki w sciezce juz nie.
const encodePath = (path) =>
  String(path || '').split('/').map(encodeURIComponent).join('/');

// Czy jestesmy na waskim ekranie. Sprawdzane realnym media query, a nie
// szerokoscia okna przepisywana przy kazdym resize - matchMedia odpala sie
// tylko wtedy, gdy warunek faktycznie zmienia stan.
const MOBILE_QUERY = '(max-width: 768px)';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );

  React.useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => setIsMobile(event.matches);
    mq.addEventListener('change', onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
};

// Jeden wpis aktualnosci w karuzeli na desktopie.
const NewsItem = ({ item }) => (
  <div className="event-content">
    <div className="image-container">
      <img src={encodePath(item.img)} alt={item.title} loading="lazy" />
    </div>
    <div className="text-box">
      <h3>{item.title}</h3>
      <p>
        {String(item.text).split('\n').map((line, idx, arr) => (
          <React.Fragment key={idx}>
            {line}
            {idx < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    </div>
  </div>
);

// Powyzej tylu znakow tresc zwijamy i dajemy "Czytaj wiecej". Zawiadomienie
// o zebraniu potrafi miec osiem punktow porzadku obrad - w calosci zjada
// caly ekran i spycha wszystko ponizej poza zasieg.
const DLUGI_TEKST = 260;

// Aktualnosci na telefonie.
//
// Na ekranie stoi zawsze JEDNA aktualnosc, domyslnie najnowsza. Reszta
// jest pod polem wyboru - natywnym <select>, ktory na telefonie otwiera
// systemowa liste, wiec obsluguje i trzy, i trzydziesci wpisow bez zmiany
// wygladu strony. Wysokosc sekcji jest staa niezaleznie od liczby wpisow.
const MobileNews = ({ items }) => {
  const [index, setIndex] = React.useState(0);
  const [rozwiniete, setRozwiniete] = React.useState(false);

  // Gdy przewodniczacy doda lub usunie wpis w panelu, wracamy na najnowszy.
  React.useEffect(() => { setIndex(0); }, [items.length]);

  // Kazda zmiana wpisu zaczyna od zwinietej tresci - inaczej krotki wpis
  // dziedziczylby "rozwiniete" po poprzednim, dlugim.
  React.useEffect(() => { setRozwiniete(false); }, [index]);

  const item = items[index] || items[0];
  const tekst = String(item.text || '');
  const doZwijania = tekst.length > DLUGI_TEKST;

  const idzDo = (next) => {
    setIndex(Math.min(Math.max(next, 0), items.length - 1));
  };

  return (
    <div className="news">
      {items.length > 1 && (
        <div className="news__select">
          <select
            aria-label="Wybierz aktualność"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
          >
            {items.map((entry, i) => (
              <option key={`${entry.title}-${i}`} value={i}>
                {entry.title}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <article className="news__card">
        {item.img && (
          <div className="news__media">
            <img src={encodePath(item.img)} alt={item.title} loading="lazy" />
          </div>
        )}

        <div className="news__body">
          {index === 0 && items.length > 1 && (
            <span className="news__badge">Najnowsza</span>
          )}

          <h3 className="news__title">{item.title}</h3>

          <div className={`news__text${rozwiniete || !doZwijania ? ' is-open' : ''}`}>
            {tekst.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>

          {doZwijania && (
            <button
              type="button"
              className="news__more"
              aria-expanded={rozwiniete}
              onClick={() => setRozwiniete((v) => !v)}
            >
              {rozwiniete ? 'Zwiń' : 'Czytaj więcej'}
            </button>
          )}
        </div>
      </article>

      {items.length > 1 && (
        <nav className="news__nav" aria-label="Nawigacja aktualności">
          <button
            type="button"
            className="news__arrow"
            onClick={() => idzDo(index - 1)}
            disabled={index === 0}
            aria-label="Nowsza aktualność"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Kropki tylko wtedy, gdy da sie je policzyc wzrokiem. Przy
              dwudziestu wpisach zamieniamy je na licznik. */}
          {items.length <= 7 ? (
            <span className="news__dots">
              {items.map((entry, i) => (
                <button
                  key={`${entry.title}-dot-${i}`}
                  type="button"
                  className={`news__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Aktualność ${i + 1}: ${entry.title}`}
                  aria-current={i === index}
                />
              ))}
            </span>
          ) : (
            <span className="news__counter">{index + 1} / {items.length}</span>
          )}

          <button
            type="button"
            className="news__arrow"
            onClick={() => idzDo(index + 1)}
            disabled={index === items.length - 1}
            aria-label="Starsza aktualność"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
};

const Features = () => {
  const { fontSize, isDarkMode } = useTheme();
  const isMobile = useIsMobile();

  // Tresc pochodzi z src/content/aktualnosci.json - w kodzie nie ma zadnych wpisow.
  const items = (aktualnosci.wpisy || []).filter((item) => item.published !== false);

  if (!items.length) return null;

  return (
    <FeaturesContainer fontSize={fontSize} isDarkMode={isDarkMode} id="features" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Aktualności Dolinka Olkusz</h2>
          <p>Najnowsze wydarzenia, imprezy i inicjatywy na Osiedlu Młodych w Olkuszu.</p>
        </div>
        {isMobile ? (
          // Na telefonie zadnej karuzeli. Przesuwanie palcem w bibliotece
          // react-responsive-carousel gryzie sie z przewijaniem strony:
          // gest w bok czesto laduje jako scroll w dol i slajd wraca.
          <MobileNews items={items} />
        ) : (
          <div className="carousel-container">
            <div className="carousel-wrapper">
              <Carousel
                showArrows={true}
                showStatus={false}
                showThumbs={false}
                infiniteLoop={items.length > 1}
                autoPlay={items.length > 1}
                interval={5000}
                stopOnHover={true}
                emulateTouch={true}
                swipeable={true}
                className={`${isDarkMode ? 'dark-carousel' : 'light-carousel'} carousel-with-spacing`}
              >
                {items.map((item, i) => (
                  <div key={`${item.title}-${i}`} className="slide-item">
                    <NewsItem item={item} />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        )}
      </div>
    </FeaturesContainer>
  );
};

export default Features;
