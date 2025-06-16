import React, { useState, useCallback, useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './lazyimage.css';

export const LazyImage = ({ src, alt, className, placeholderSrc, onError }) => {
  // Stan do śledzenia, czy wystąpił błąd podczas ładowania obrazu
  const [imgError, setImgError] = useState(false);
  
  // Domyślny placeholder dla obrazów (mały, zamazany)
  const defaultPlaceholder = placeholderSrc || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=";

  // Domyślny obraz w przypadku błędu
  const fallbackImage = process.env.PUBLIC_URL + '/img/logo.jpg';
  
  // Funkcja do sprawdzania, czy obraz istnieje
  const checkImageExists = useCallback((imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageSrc;
    });
  }, []);
  
  // Obsługa błędu ładowania obrazu - używamy useCallback aby uniknąć problemów z zależnościami
  const handleImageError = useCallback(() => {
    console.error("Błąd ładowania obrazu:", src);
    setImgError(true);
    // Wywołaj funkcję onError przekazaną z komponentu nadrzędnego, jeśli istnieje
    if (onError && typeof onError === 'function') {
      onError();
    }
  }, [src, onError]);

  // Wywołanie sprawdzenia istnienia obrazu po zamontowaniu komponentu
  useEffect(() => {
    let isMounted = true;
    if (src) {
      checkImageExists(src).then(exists => {
        if (isMounted && !exists) {
          handleImageError();
        }
      });
    }
    return () => { isMounted = false; };
  }, [src, handleImageError, checkImageExists]);
  
  // Jeśli już wystąpił błąd, nie używaj WebP, tylko od razu pokaż fallback
  if (imgError) {
    return (
      <LazyLoadImage
        alt={alt || "Obraz nie został załadowany"}
        src={fallbackImage}
        effect="blur"
        className={className}
        placeholderSrc={defaultPlaceholder}
        threshold={100}
        loading="eager" // Zmiana na eager aby przyspieszyć ładowanie
        decoding="async"
      />
    );
  }

  // Standardowy render dla obrazów
  return (
    <picture>
      {/* Jeśli przeglądarka obsługuje WebP, spróbuj użyć go w pierwszej kolejności */}
      <source srcSet={src.replace(/\.(jpg|jpeg|png)$/i, '.webp')} type="image/webp" />
      <LazyLoadImage
        alt={alt}
        src={src}
        effect="blur"
        className={className}
        placeholderSrc={defaultPlaceholder}
        threshold={100}
        loading="eager" // Zmieniam na eager, aby rozwiązać problemy z lazy-loading
        decoding="async"
        onError={handleImageError}
        retry={{ count: 3, delay: 2 }} // Dodanie prób ponownego ładowania
      />
    </picture>
  );
};
