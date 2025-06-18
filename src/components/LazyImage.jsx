import React, { useState, useEffect, useCallback } from "react";
import { motion } from 'framer-motion';
import './lazyimage.css';

const LazyImage = ({ src, alt, className, onClick, priority, placeholderSrc, width, height, sizes, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  useEffect(() => {
    console.log('Loading image:', src);
    const img = new Image();
    img.onload = () => {
      console.log('Image loaded successfully:', src);
      setLoaded(true);
    };
    img.onerror = () => {
      console.error('Error loading image:', src);
      setImgError(true);
    };
    img.src = src;
  }, [src]);
  
  // Opcje dla IntersectionObserver - jeśli obraz jest priorytetowy, ładuj go od razu
  const observerOptions = {
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: priority ? '200px' : '50px' // Większy margines dla priorytetowych obrazów
  };
  
  // Domyślny placeholder dla obrazów (mały, zamazany)
  const defaultPlaceholder = placeholderSrc || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=";

  // Domyślny obraz w przypadku błędu
  const fallbackImage = process.env.PUBLIC_URL + '/img/logo.jpg';
  
  // Sprawdź, czy dostępna jest wersja WebP
  const [srcWebP, setSrcWebP] = useState('');
  const [srcSets, setSrcSets] = useState({});
  
  // Funkcja do sprawdzania, czy obraz istnieje
  const checkImageExists = useCallback((imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageSrc;
    });
  }, []);
  
  // Obsługa błędu ładowania obrazu
  const handleImageError = useCallback(() => {
    console.error("Błąd ładowania obrazu:", src);
    setImgError(true);
    // Wywołaj funkcję onError przekazaną z komponentu nadrzędnego, jeśli istnieje
    if (onError && typeof onError === 'function') {
      onError();
    }
  }, [src, onError]);

  const handleImageLoad = () => {
    setLoaded(true);
  };

  // Przygotowanie alternatywnych źródeł obrazu
  useEffect(() => {
    if (src) {
      // Generuj potencjalne ścieżki dla różnych formatów i rozmiarów
      const basePath = src.substring(0, src.lastIndexOf('.')) || src;
      const extension = src.substring(src.lastIndexOf('.')) || '';
      
      // Próbuj znaleźć wersję WebP
      const potentialWebP = `${basePath}.webp`;
      
      // Generuj potencjalne srcset dla responsywnych obrazów
      const potentialThumbnail = `${basePath.replace('/img/', '/img/thumbnails/')}${extension}`;
      const potentialMedium = `${basePath.replace('/img/', '/img/medium/')}${extension}`;
      const potentialLarge = `${basePath.replace('/img/', '/img/large/')}${extension}`;
      
      // Przygotuj srcset dla różnych rozmiarów
      const imgSrcSet = {
        thumbnail: potentialThumbnail,
        medium: potentialMedium,
        large: potentialLarge,
        original: src
      };
      
      // Sprawdź WebP
      checkImageExists(potentialWebP).then(exists => {
        if (exists) setSrcWebP(potentialWebP);
      });
      
      // Ustaw dostępne wersje srcset
      setSrcSets(imgSrcSet);
    }
  }, [src, checkImageExists]);

  // Animacja dla obrazu
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Jeśli już wystąpił błąd, nie używaj WebP, tylko od razu pokaż fallback
  if (imgError) {
    return (
      <motion.div 
        className={`lazy-image-container ${className || ''} ${loaded ? 'loaded' : ''}`}
        initial="hidden"
        animate="visible"
        variants={variants}
        onClick={onClick}
      >
        <img 
          src={fallbackImage}
          alt={alt || "Obraz nie został załadowany"}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />
      </motion.div>
    );
  }

  // Standardowy render dla obrazów
  return (
    <motion.div 
      className={`lazy-image-container ${className || ''} ${loaded ? 'loaded' : ''}`}
      initial="hidden"
      animate="visible"
      variants={variants}
      onClick={onClick}
    >
      <img 
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s'
        }}
      />
    </motion.div>
  );
};

export default LazyImage;
