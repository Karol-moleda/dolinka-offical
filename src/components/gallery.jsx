import React, { useState, useEffect, useCallback, useContext } from "react";
import LazyImage from "./LazyImage";
import './gallery.css';
import styled from "styled-components";
import { AppContext } from "../App";

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
  
  .pagination {
    button, span {
      font-size: inherit;
      color: ${props => props.isDarkMode ? '#ffffff' : '#333333'};
      background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#f8f9fa'};
      
      &:hover {
        background-color: ${props => props.isDarkMode ? '#333333' : '#e9ecef'};
      }
      
      &.active {
        background-color: ${props => props.isDarkMode ? '#42a5f5' : '#608dfd'};
        color: ${props => props.isDarkMode ? '#000000' : '#ffffff'};
      }
    }
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
  const { fontSize, isDarkMode } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12;
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Obliczanie stron i widocznych obrazów
  const totalPages = props.data ? Math.ceil(props.data.length / imagesPerPage) : 1;
  const visibleImages = props.data ? props.data.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage) : [];

  // Helper do ścieżek
  const getImagePath = (path) => {
    if (!path) return '';
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return process.env.PUBLIC_URL + '/' + cleanPath;
  };

  // Lightbox
  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
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
    const handleKeyPress = (e) => {
      if (!lightboxOpen) return;
      switch (e.key) {
        case 'Escape': closeLightbox(); break;
        case 'ArrowLeft': navigateImage('prev'); break;
        case 'ArrowRight': navigateImage('next'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, navigateImage]);

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
          <div className="modern-gallery-grid">
            {visibleImages.map((image, index) => (
              <div className="gallery-item" key={`${image.title}-${index}`}> 
                <LazyImage 
                  src={getImagePath(image.smallImage)}
                  alt={image.title || `Zdjęcie ${index + 1}`}
                  className="gallery-image"
                  onClick={() => openLightbox(image)}
                />
                {image.title && <h4>{image.title}</h4>}
              </div>
            ))}
          </div>
          {/* Paginacja */}
          {totalPages > 1 && (
            <div className="gallery-pagination">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                </li>
                {[...Array(totalPages)].map((_, idx) => (
                  <li key={idx+1} className={`page-item ${currentPage === idx+1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(idx+1)}>{idx+1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                </li>
              </ul>
            </div>
          )}
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
