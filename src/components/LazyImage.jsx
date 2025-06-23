import React, { useState, useEffect, useRef, useCallback } from "react";
import './lazyimage.css';

const LazyImage = ({ src, alt, className, onClick, priority = false, placeholderSrc, width, height, sizes, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const hasTriggeredLoad = useRef(false);
  
  // Funkcja ładująca obraz
  const loadImage = useCallback(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => {
      setImgError(true);
      if (onError && typeof onError === 'function') {
        onError();
      }
    };
    img.src = src;
  }, [src, onError]);
  
  // Ładowanie obrazu tylko wtedy, gdy komponent jest widoczny lub priorytetowy
  useEffect(() => {
    // Jeśli to obraz priorytetowy, załaduj go natychmiast
    if (priority) {
      loadImage();
      return;
    }

    // Utworzenie Intersection Observer
    const currentImgRef = imgRef.current;
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasTriggeredLoad.current) {
        hasTriggeredLoad.current = true;
        loadImage();
        // Przestań obserwować po załadowaniu
        if (observerRef.current && currentImgRef) {
          observerRef.current.unobserve(currentImgRef);
        }
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    
    if (currentImgRef) {
      observerRef.current.observe(currentImgRef);
    }
    
    return () => {
      if (observerRef.current && currentImgRef) {
        observerRef.current.unobserve(currentImgRef);
        observerRef.current.disconnect();
      }
    };
  }, [priority, loadImage]);
  
  // Domyślny obraz w przypadku błędu
  const fallbackImage = process.env.PUBLIC_URL + '/img/logo.jpg';

  // Jeśli już wystąpił błąd, pokaż fallback
  if (imgError) {
    return (
      <div 
        className={`lazy-image-container ${className || ''} ${loaded ? 'loaded' : ''}`}
        onClick={onClick}
      >
        <img 
          src={fallbackImage}
          alt={alt || "Obraz nie został załadowany"}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 1,
            transition: 'opacity 0.3s'
          }}
        />
      </div>
    );
  }

  // Standardowy render dla obrazów
  return (
    <div 
      className={`lazy-image-container ${className || ''} ${loaded ? 'loaded' : ''}`}
      onClick={onClick}
      ref={imgRef}
    >
      {!loaded && (
        <div className="placeholder" style={{ backgroundColor: '#f0f0f0' }}></div>
      )}
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
        onLoad={() => setLoaded(true)}
        onError={() => setImgError(true)}
      />
    </div>
  );
};

export default LazyImage;
