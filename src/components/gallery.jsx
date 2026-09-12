import React, { useState, useEffect, useCallback, useMemo } from "react";
import LazyImage from "./LazyImage";
import './gallery.css';
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";
import albumy from "../content/galeria.json";

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

// Spacje i polskie znaki w nazwach plikow musza byc zakodowane,
// ale ukosniki w sciezce juz nie.
const encodePath = (path) => {
  const clean = String(path || '').trim().replace(/\\/g, '/');
  if (!clean) return '';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.split('/').map(encodeURIComponent).join('/');
};

const Gallery = () => {
  const { fontSize, isDarkMode } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeYear, setActiveYear] = useState('');
  const [activeAlbum, setActiveAlbum] = useState('');

  // Tresc pochodzi z src/content/galeria.json - w kodzie nie ma zadnych sciezek.
  const publishedAlbums = useMemo(
    () => albumy
      .filter((album) => album.published !== false)
      .map((album) => ({
        ...album,
        year: String(album.year || ''),
        photos: (album.photos || []).filter(Boolean),
      }))
      .filter((album) => album.photos.length),
    []
  );

  // Lata schodza od najnowszego.
  const years = useMemo(
    () => [...new Set(publishedAlbums.map((album) => album.year))].sort((a, b) => b.localeCompare(a)),
    [publishedAlbums]
  );

  const albumsOfYear = useMemo(
    () => publishedAlbums.filter((album) => album.year === activeYear),
    [publishedAlbums, activeYear]
  );

  useEffect(() => {
    if (years.length && !years.includes(activeYear)) {
      setActiveYear(years[0]);
    }
  }, [years, activeYear]);

  useEffect(() => {
    if (albumsOfYear.length && !albumsOfYear.some((album) => album.title === activeAlbum)) {
      setActiveAlbum(albumsOfYear[0].title);
    }
  }, [albumsOfYear, activeAlbum]);

  const visiblePhotos = useMemo(() => {
    const album = albumsOfYear.find((item) => item.title === activeAlbum);
    return album ? album.photos : [];
  }, [albumsOfYear, activeAlbum]);

  const openLightbox = useCallback((photo) => {
    setSelectedImage(photo);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const navigateImage = useCallback((direction) => {
    if (!selectedImage || !visiblePhotos.length) return;
    const current = visiblePhotos.indexOf(selectedImage);
    if (current === -1) return;
    const next = direction === 'next'
      ? (current + 1) % visiblePhotos.length
      : (current - 1 + visiblePhotos.length) % visiblePhotos.length;
    setSelectedImage(visiblePhotos[next]);
  }, [selectedImage, visiblePhotos]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const handleKeyPress = (event) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') navigateImage('prev');
      if (event.key === 'ArrowRight') navigateImage('next');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, navigateImage, closeLightbox]);

  if (!publishedAlbums.length) return null;

  return (
    <GalleryContainer id="portfolio" className="text-center gallery-section" fontSize={fontSize} isDarkMode={isDarkMode}>
      <div className="container">
        <div className="section-title">
          <h2>Galeria</h2>
          <p>Zobacz zdjęcia z naszych działań i wydarzeń.</p>
        </div>
        <div className="gallery-container">
          {years.length > 1 && (
            <div className="gallery-tabs" style={{ marginBottom: '15px' }}>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`gallery-tab ${activeYear === year ? 'active' : ''}`}
                  onClick={() => setActiveYear(year)}
                >
                  Rok {year}
                  <span className="tab-count">
                    ({publishedAlbums
                      .filter((album) => album.year === year)
                      .reduce((sum, album) => sum + album.photos.length, 0)})
                  </span>
                </button>
              ))}
            </div>
          )}

          {albumsOfYear.length > 1 && (
            <div className="gallery-tabs">
              {albumsOfYear.map((album) => (
                <button
                  key={album.title}
                  type="button"
                  className={`gallery-tab ${activeAlbum === album.title ? 'active' : ''}`}
                  onClick={() => setActiveAlbum(album.title)}
                >
                  {album.title}
                  <span className="tab-count">({album.photos.length})</span>
                </button>
              ))}
            </div>
          )}

          <div className="modern-gallery-grid">
            {visiblePhotos.map((photo, index) => (
              <div className="gallery-item" key={photo}>
                <LazyImage
                  src={encodePath(photo)}
                  alt={`${activeAlbum} – zdjęcie ${index + 1}`}
                  className="gallery-image"
                  objectFit="contain"
                  onClick={() => openLightbox(photo)}
                  priority={index < 4}
                />
              </div>
            ))}
          </div>

          <div className="gallery-info">
            <p>Wyświetlane: {visiblePhotos.length} zdjęć z albumu „{activeAlbum}" ({activeYear})</p>
          </div>
        </div>

        {lightboxOpen && selectedImage && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Zamknij">×</button>
              <button type="button" className="lightbox-nav prev" onClick={() => navigateImage('prev')} aria-label="Poprzednie zdjęcie">‹</button>
              <img src={encodePath(selectedImage)} alt={`${activeAlbum} – powiększone zdjęcie`} />
              <button type="button" className="lightbox-nav next" onClick={() => navigateImage('next')} aria-label="Następne zdjęcie">›</button>
            </div>
          </div>
        )}
      </div>
    </GalleryContainer>
  );
};

export default Gallery;
