import React, { useState } from "react";
import { LazyImage } from "./LazyImage";

export const Image = ({ title, largeImage, smallImage }) => {
  const [imageError, setImageError] = useState(false);
  
  // Przygotowanie ścieżek do obrazów
  const largeImagePath = process.env.PUBLIC_URL + '/' + largeImage;
  const smallImagePath = process.env.PUBLIC_URL + '/' + smallImage;
  
  // Domyślny obraz, który zostanie użyty w przypadku błędu
  const fallbackImage = process.env.PUBLIC_URL + '/img/logo.jpg';
  
  // Obsługa błędu ładowania obrazu
  const handleImageError = () => {
    console.error(`Nie udało się załadować obrazu: ${smallImage}`);
    setImageError(true);
  };
  
  return (
    <div className="portfolio-item">
      <div className="hover-bg">
        {" "}
        <a 
          href={imageError ? fallbackImage : largeImagePath} 
          title={title} 
          data-lightbox-gallery="gallery1"
        >
          <div className="hover-text">
            <h4>{title}</h4>
          </div>
          <LazyImage 
            src={smallImagePath} 
            className={`img-responsive ${imageError ? 'img-error' : ''}`}
            alt={title} 
            onError={handleImageError}
            placeholderSrc={process.env.PUBLIC_URL + '/img/logo.jpg'}
          />{" "}
        </a>{" "}
      </div>
    </div>
  );
};
