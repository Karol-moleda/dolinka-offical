import React, { useState, useEffect, useCallback, useMemo } from "react";
import LazyImage from "./LazyImage";
import './gallery.css';
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

const gallery2026Events = [
  {
    title: "Wielkanoc 2026",
    folder: "Wielkanoc",
    files: Array.from({ length: 14 }, (_, index) => `wielkanoc-${index + 1}.jpg`),
  },
  {
    title: "Festiwal Dmuchańców",
    folder: "festiwal-dmuchancow",
    files: Array.from({ length: 18 }, (_, index) => `festiwal-dmuchancow-${index + 1}.jpg`),
  },
  {
    title: "Sprzątanie osiedla",
    folder: "sprzatanie-osiedla",
    files: Array.from({ length: 5 }, (_, index) => `sprzatanie-osiedla-${index + 1}.jpg`),
  },
  {
    title: "Święto flagi",
    folder: "swieto-flagi",
    files: Array.from({ length: 15 }, (_, index) => `swieto-flagi-${index + 1}.jpg`),
  },
  {
    title: "Turniej Siatkówki 2026",
    folder: "Turniej-Siatkowki",
    files: [
      "DSC_6133.JPG",
      "DSC_6155-Picsart-AiImageEnhancer.JPG",
      "DSC_6158.JPG",
      "DSC_6162.jpg",
      "DSC_6163.JPG",
      "DSC_6165.JPG",
      "DSC_6169.JPG",
      "DSC_6179.JPG",
      "DSC_6181.JPG",
      "DSC_6186.JPG",
      "DSC_6198.JPG",
      "DSC_6200.JPG",
      "DSC_6203.JPG",
      "DSC_6208.JPG",
      "DSC_6215.JPG",
      "DSC_6240.JPG",
      "DSC_6241.JPG",
      "DSC_6242.JPG",
      "DSC_6247.JPG",
      "DSC_6268.JPG",
      "DSC_6272.JPG",
      "DSC_6279.JPG",
      "DSC_6285.JPG",
      "DSC_6307.JPG",
      "DSC_6319.JPG",
      "DSC_6337.JPG",
      "DSC_6360.JPG",
      "DSC_6380.JPG",
      "DSC_6398.JPG",
      "DSC_6399.JPG",
      "DSC_6441.JPG",
      "DSC_6451.JPG",
      "DSC_6460.JPG",
      "DSC_6516.JPG",
      "DSC_6524.JPG",
      "DSC_6532.JPG",
      "DSC_6543-Picsart-AiImageEnhancer.JPG",
      "DSC_6565.JPG",
      "DSC_6574.JPG",
      "DSC_6575.JPG",
      "DSC_6576.JPG",
      "DSC_6578.JPG",
      "DSC_6582.JPG",
      "DSC_6595.JPG",
      "DSC_6596.JPG",
      "DSC_6602.JPG",
      "DSC_6616.JPG",
      "DSC_6632.JPG",
      "DSC_6653.JPG",
      "DSC_6660.JPG",
      "DSC_6667.JPG",
      "DSC_6683.JPG",
      "DSC_6685.JPG",
    ],
  },
];

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
  const [activeYear, setActiveYear] = useState("");
  const [activeTab, setActiveTab] = useState('');

  const extraImages2026 = useMemo(
    () => gallery2026Events.flatMap((event) =>
      event.files.map((fileName) => {
        const imagePath = `/img/event/2026/${event.folder}/${fileName}`;

        return {
          title: event.title,
          year: "2026",
          largeImage: imagePath,
          smallImage: imagePath,
        };
      })
    ),
    []
  );

  const allImages = useMemo(() => {
    const baseImages = Array.isArray(props.data) ? props.data : [];
    const has2026Wielkanoc = baseImages.some((image) =>
      String(image?.smallImage || image?.largeImage || "").includes("/img/event/2026/")
    );

    return has2026Wielkanoc ? baseImages : [...baseImages, ...extraImages2026];
  }, [props.data, extraImages2026]);

  const normalizeImagePath = useCallback((path) => {
    if (!path) return "";

    let normalizedPath = String(path).trim().replace(/\\/g, "/");
    if (!normalizedPath.startsWith("/")) {
      normalizedPath = `/${normalizedPath}`;
    }

    if (/^\/img\/event\/(?!2025\/|2026\/)/.test(normalizedPath)) {
      normalizedPath = normalizedPath.replace(/^\/img\/event\//, "/img/event/2025/");
    }

    return normalizedPath;
  }, []);

  const galleryImages = useMemo(() => {
    return allImages.map((image) => {
      const normalizedSmall = normalizeImagePath(image.smallImage);
      const normalizedLarge = normalizeImagePath(image.largeImage);
      const sourcePath = normalizedSmall || normalizedLarge;

      const yearMatch = sourcePath.match(/\/img\/event\/(2025|2026)\//);
      const year = image.year || (yearMatch ? yearMatch[1] : "Inne");

      return {
        ...image,
        year,
        smallImage: normalizedSmall,
        largeImage: normalizedLarge,
      };
    }).filter((image) => image.year === "2025" || image.year === "2026");
  }, [allImages, normalizeImagePath]);

  const years = useMemo(() => {
    const orderedYears = ["2026", "2025"];
    return orderedYears.filter((year) => galleryImages.some((image) => image.year === year));
  }, [galleryImages]);

  // Organizacja zdjęć według kategorii wydarzeń (w obrębie roku)
  const categories = useMemo(() => {
    if (!galleryImages.length || !activeYear) return {};
    
    const grouped = galleryImages
      .filter((image) => image.year === activeYear)
      .reduce((acc, image) => {
      const category = image.title || 'Inne';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(image);
      return acc;
    }, {});
    
    return grouped;
  }, [galleryImages, activeYear]);

  const categoryNames = useMemo(() => {
    return Object.keys(categories).sort();
  }, [categories]);

  // Ustawienie domyślnego roku
  useEffect(() => {
    if (years.length > 0 && !activeYear) {
      setActiveYear(years[0]);
    }
  }, [years, activeYear]);

  // Ustawienie domyślnej aktywnej kategorii
  useEffect(() => {
    if (categoryNames.length > 0 && !activeTab) {
      setActiveTab(categoryNames[0]);
    }
  }, [categoryNames, activeTab]);

  useEffect(() => {
    if (categoryNames.length > 0 && !categoryNames.includes(activeTab)) {
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
    if (!selectedImage || !visibleImages.length) return;
    const currentIndex = visibleImages.findIndex(img => img.largeImage === selectedImage.largeImage);
    if (currentIndex === -1) return;
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % visibleImages.length;
    } else {
      newIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    }
    setSelectedImage(visibleImages[newIndex]);
  }, [selectedImage, visibleImages]);

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
  if (!galleryImages.length) {
    return <div>Ładowanie galerii...</div>;
  }

  return (
    <GalleryContainer id="portfolio" className="text-center gallery-section" fontSize={fontSize} isDarkMode={isDarkMode}>
      <div className="container">
        <div className="section-title">
          <h2>Galeria</h2>
          <p>Zobacz zdjęcia z naszych działań i wydarzeń z lat 2025 i 2026.</p>
        </div>
        <div className="gallery-container">
          {/* Taby lat */}
          {years.length > 1 && (
            <div className="gallery-tabs" style={{ marginBottom: "15px" }}>
              {years.map((year) => (
                <button
                  key={year}
                  className={`gallery-tab ${activeYear === year ? "active" : ""}`}
                  onClick={() => {
                    setActiveYear(year);
                    setActiveTab("");
                  }}
                >
                  Rok {year}
                  <span className="tab-count">
                    ({galleryImages.filter((image) => image.year === year).length})
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Taby kategorii */}
          {categoryNames.length > 1 && (
            <div className="gallery-tabs">
              {categoryNames.map((category) => (
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
                  objectFit="contain"
                  onClick={() => openLightbox(image)}
                  priority={index < 4} // Priorytetowe ładowanie tylko pierwszych 4 obrazków
                />
              </div>
            ))}
          </div>
          
          {/* Informacja o liczbie zdjęć */}
          <div className="gallery-info">
            <p>Wyświetlane: {visibleImages.length} zdjęć z roku {activeYear} w kategorii "{activeTab}"</p>
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
            </div>
          </div>
        )}
      </div>
    </GalleryContainer>
  );
};

export default Gallery;
