import React, { useState, useEffect, useCallback, useMemo } from "react";
import LazyImage from "./LazyImage";
import './gallery.css';
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

const GalleryContainer = styled.div`
  background-color: ${props => props.isDarkMode ? '#000000' : 'transparent'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};

  .section-title {
    h2 {
      font-size: calc(${props => props.fontSize}px * 1.5);
      color: ${props => props.isDarkMode ? '#ffffff' : '#2c3e50'};
    }
    p {
      font-size: inherit;
      color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
    }
  }
  
  .gallery-message {
    font-size: inherit;
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  }
  
  .gallery-tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 30px;
    padding: 0 15px;
  }
  
  .gallery-tab {
    font-size: inherit;
    padding: 12px 20px;
    border: 2px solid ${props => props.isDarkMode ? '#444444' : '#e0e0e0'};
    background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    
    &:hover {
      border-color: ${props => props.isDarkMode ? '#42a5f5' : '#608dfd'};
      background-color: ${props => props.isDarkMode ? '#2a2a2a' : '#f8f9fa'};
      transform: translateY(-2px);
    }
    
    &.active {
      background-color: ${props => props.isDarkMode ? '#42a5f5' : '#608dfd'};
      color: ${props => props.isDarkMode ? '#000000' : '#ffffff'};
      border-color: ${props => props.isDarkMode ? '#42a5f5' : '#608dfd'};
      font-weight: 600;
    }
    
    .tab-count {
      margin-left: 8px;
      font-size: 0.85em;
      opacity: 0.8;
    }
  }
  
  .gallery-info {
    text-align: center;
    margin-top: 20px;
    font-size: inherit;
    color: ${props => props.isDarkMode ? '#cccccc' : '#666666'};
  }
  
  .gallery-caption {
    p {
      font-size: inherit;
      color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
    }
  }
  
  .lightbox-control button {
    font-size: inherit;
    background-color: ${props => props.isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
  }
`;

const Gallery = (props) => {
  const { fontSize, isDarkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  // Organizacja zdjęć według kategorii wydarzeń
  const categories = useMemo(() => {
    if (!props.data) return {};
    
    const grouped = props.data.reduce((acc, image) => {
      const category = image.title || 'Inne';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(image);
      return acc;
    }, {});
    
    return grouped;
  }, [props.data]);

  const categoryNames = useMemo(() => {
    return Object.keys(categories).sort();
  }, [categories]);

  // Ustawienie domyślnej aktywnej kategorii
  useEffect(() => {
    if (categoryNames.length > 0 && !activeTab) {
      setActiveTab(categoryNames[0]);
    }
  }, [categoryNames, activeTab]);

  // Pobranie zdjęć dla aktywnej kategorii
  const visibleImages = useMemo(() => {
    return categories[activeTab] || [];
  }, [categories, activeTab]);

  // Helper do ścieżek
  const getImagePath = useCallback((path) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return process.env.PUBLIC_URL + '/' + cleanPath;
  }, []);

  // Lightbox
  const openLightbox = useCallback((image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!selectedImage || !props.data) return;
    const currentIndex = props.data.findIndex(img => img.largeImage === selectedImage.largeImage);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % props.data.length;
    } else {
      newIndex = (currentIndex - 1 + props.data.length) % props.data.length;
    }
    setSelectedImage(props.data[newIndex]);
  }, [selectedImage, props.data]);

  // Obsługa klawiszy w lightboxie
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'Escape': closeLightbox(); break;
        case 'ArrowLeft': navigateImage('prev'); break;
        case 'ArrowRight': navigateImage('next'); break;
        default: break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, navigateImage, closeLightbox]);

  // Render
  if (!props.data) {
    return <div>Ładowanie galerii...</div>;
  }

  return (
    <GalleryContainer id="portfolio" className="text-center gallery-section" fontSize={fontSize} isDarkMode={isDarkMode}>
      <div className="container">
        <div className="section-title">
          <h2>Galeria</h2>
          <p>Zobacz zdjęcia z naszych działań i wydarzeń.</p>
        </div>
        <div className="gallery-container">
          {/* Taby kategorii */}
          {categoryNames.length > 1 && (
            <div className="gallery-tabs">
              {categoryNames.map((category, index) => (
                <button
                  key={category}
                  className={`gallery-tab ${activeTab === category ? 'active' : ''}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category}
                  <span className="tab-count">({categories[category]?.length || 0})</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Galeria zdjęć */}
          <div className="modern-gallery-grid">
            {visibleImages.map((image, index) => (
              <div className="gallery-item" key={`${image.title}-${index}`}> 
                <LazyImage 
                  src={getImagePath(image.smallImage)}
                  alt={image.title || `Zdjęcie ${index + 1}`}
                  className="gallery-image"
                  onClick={() => openLightbox(image)}
                  priority={index < 4} // Priorytetowe ładowanie tylko pierwszych 4 obrazków
                />
                {image.title && <h4>{image.title}</h4>}
              </div>
            ))}
          </div>
          
          {/* Informacja o liczbie zdjęć */}
          <div className="gallery-info">
            <p>Wyświetlane: {visibleImages.length} zdjęć w kategorii "{activeTab}"</p>
          </div>
        </div>
        {/* Lightbox */}
        {lightboxOpen && selectedImage && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={e => e.stopPropagation()}>
              <button className="lightbox-close" onClick={closeLightbox}>×</button>
              <button className="lightbox-nav prev" onClick={() => navigateImage('prev')}>‹</button>
              <img src={getImagePath(selectedImage.largeImage)} alt={selectedImage.title || "Powiększone zdjęcie"} />
              <button className="lightbox-nav next" onClick={() => navigateImage('next')}>›</button>
              {selectedImage.title && <div className="lightbox-caption"><h3>{selectedImage.title}</h3></div>}
            </div>
          </div>
        )}
      </div>
    </GalleryContainer>
  );
};

export default Gallery;
