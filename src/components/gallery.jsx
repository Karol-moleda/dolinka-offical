import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [visibleImages, setVisibleImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);  
  const [masonryKey, setMasonryKey] = useState(0); // Klucz do wymuszenia ponownego renderowania Masonry
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Stan paginacji
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const imagesPerPage = 12; // Liczba obrazów na stronę
  const galleryRef = useRef(null); // Referencja do całego komponentu galerii
  
  // Breakpointy dla układu Masonry
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };  // Całkowicie przebudowana funkcja ładująca zdjęcia z absolutnym zablokowaniem przewijania
  const loadPageImages = useCallback((page, event) => {
    // Zapobiegamy wszelkim domyślnym zachowaniom i propagacji zdarzeń
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Jeśli to ta sama strona co obecnie wyświetlana, nic nie robimy
    if (page === currentPage) return;
    
    if (!props.data) return;
    
    try {
      // KLUCZOWE: Zapisujemy aktualną pozycję przewijania przed jakąkolwiek operacją
      const scrollY = window.scrollY;
      
      // Ustawiamy loading na true
      setLoading(true);
      
      // WAŻNE: Tworzymy funkcję, która będzie przywracać pozycję przewijania
      const restoreScroll = () => window.scrollTo(0, scrollY);
      
      // Natychmiast przywracamy pozycję przewijania, aby zapobiec ewentualnym przeskokom
      restoreScroll();
      
      // Blokujemy przewijanie strony podczas ładowania obrazów
      document.body.style.overflow = 'hidden';
      
      // Obliczamy przedział zdjęć dla wybranej strony
      const startIndex = (page - 1) * imagesPerPage;
      const endIndex = startIndex + imagesPerPage;
      console.log(`Ładowanie strony ${page}: obrazy od ${startIndex} do ${endIndex - 1}`);
      
      // Wybieramy tylko zdjęcia dla aktualnej strony
      const pageImages = props.data.slice(startIndex, endIndex);

      // Używamy RAF dla najbardziej synchronicznej aktualizacji
      window.requestAnimationFrame(() => {
        // Aktualizujemy stan
        setVisibleImages(pageImages);
        setCurrentPage(page);
        setMasonryKey(prevKey => prevKey + 1);
        
        // Ponownie przywracamy pozycję przewijania
        restoreScroll();
        
        // Używamy kolejnego RAF dla zapewnienia, że wszystko jest aktualne
        window.requestAnimationFrame(() => {
          // Jeszcze raz przywracamy pozycję przewijania
          restoreScroll();
          
          // Odblokowanie przewijania po zakończeniu operacji
          document.body.style.overflow = '';
          
          // Kończymy ładowanie
          setLoading(false);
        });
      });
    } catch (err) {
      console.error("Błąd podczas ładowania obrazów:", err);
      setError(true);
      setLoading(false);
      document.body.style.overflow = ''; // Odblokowujemy przewijanie w przypadku błędu
    }
  }, [props.data, imagesPerPage, currentPage]);
  
  // Obliczanie całkowitej liczby stron
  useEffect(() => {
    if (props.data) {
      const pages = Math.ceil(props.data.length / imagesPerPage);
      setTotalPages(pages);
      console.log(`Całkowita liczba stron: ${pages}`);
    }
  }, [props.data, imagesPerPage]);
  
  // Specjalny efekt do obsługi zachowania przewijania
  useEffect(() => {
    const handleScroll = (e) => {
      // Jeśli trwa ładowanie, blokujemy przewijanie
      if (loading) {
        window.scrollTo(0, window.scrollY);
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Funkcja do obsługi kliknięć w całym dokumencie
    const handleDocumentClick = (e) => {
      // Sprawdzamy, czy kliknięcie było w paginacji
      const paginationElement = document.querySelector('.gallery-pagination');
      if (paginationElement && paginationElement.contains(e.target)) {
        // Żeby mieć pewność, że strona nie będzie się przewijać, blokujemy domyślne zdarzenie
        e.preventDefault();
        
        // Zapisujemy aktualną pozycję przewijania
        const scrollY = window.scrollY;
        
        // Ustawiamy timeout, aby przywrócić pozycję przewijania po zakończeniu zdarzeń
        setTimeout(() => window.scrollTo(0, scrollY), 10);
      }
    };

    // Dodajemy nasze handlery
    window.addEventListener('scroll', handleScroll, { passive: false });
    document.addEventListener('click', handleDocumentClick);

    return () => {
      // Usuwamy handlery po odmontowaniu komponentu
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [loading]);

  // Efekt zapobiegający przewijaniu strony przy zmianie paginacji
  useEffect(() => {
    // Funkcja do blokowania przewijania na krótki czas po zmianie strony
    const preventScrollJump = (e) => {
      if (loading) {
        // Blokowanie przewijania, gdy trwa ładowanie
        e.preventDefault();
        return false;
      }
    };

    // Dodajemy słuchacza podczas ładowania
    if (loading && visibleImages.length > 0) {
      window.addEventListener('scroll', preventScrollJump, { passive: false });
    }

    // Czyścimy po zakończeniu ładowania
    return () => {
      window.removeEventListener('scroll', preventScrollJump);
    };
  }, [loading, visibleImages.length]);

  // Helper function to get correct image path
  const getImagePath = (path) => {
    if (!path) return '';
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return process.env.PUBLIC_URL + '/' + cleanPath;
  };

  // Effect for logging image loading
  useEffect(() => {
    if (props.data) {
      console.log('Gallery data:', props.data);
      props.data.forEach((image, index) => {
        const fullPath = getImagePath(image.smallImage);
        console.log(`Image ${index + 1} path:`, fullPath);
        // Test if image exists
        const img = new Image();
        img.onload = () => console.log(`Image ${index + 1} loaded successfully:`, fullPath);
        img.onerror = () => console.error(`Image ${index + 1} failed to load:`, fullPath);
        img.src = fullPath;
      });
    }
  }, [props.data]);  // Inicjalne załadowanie pierwszej strony obrazów
  useEffect(() => {
    console.log("Inicjalizacja galerii z danymi:", props.data?.length || 0, "obrazów");
    
    if (props.data && props.data.length > 0) {
      const validImages = props.data.map(img => ({
        ...img,
        smallImage: getImagePath(img.smallImage),
        largeImage: getImagePath(img.largeImage)
      }));
      
      // Ładujemy pierwszą stronę używając przetworzonych danych
      setTimeout(() => {
        const startIndex = 0;
        const endIndex = imagesPerPage;
        const firstPageImages = validImages.slice(startIndex, endIndex);
        setVisibleImages(firstPageImages);
        setCurrentPage(1);
        setLoading(false);
      }, 100);
    }
  }, [props.data, imagesPerPage]);
  
  // Otwieranie lightboxa po kliknięciu w obraz
  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Zapobiegaj przewijaniu strony
  };
  
  // Zamykanie lightboxa
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = ''; // Przywróć przewijanie strony
  };
    // Przejście do poprzedniego/następnego obrazu w lightboxie
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
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, navigateImage]);
  
  // Warianty animacji dla galerii
  const galleryVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Skrypt wykonywany po pierwszym renderze
  useEffect(() => {
    // Funkcja, która będzie wywoływana po kliknięciu w przycisk paginacji
    const handlePaginationClick = () => {
      // Jeśli użytkownik znajduje się daleko od galerii, przewijamy do niej
      const galleryElement = document.getElementById('portfolio');
      if (galleryElement) {
        const rect = galleryElement.getBoundingClientRect();
        // Jeśli galeria jest poza widokiem, przewijamy do niej
        if (rect.top < 0 || rect.bottom > window.innerHeight) {
          galleryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    
    // Dodajemy manualnie zdarzenie do przycisków paginacji
    const buttons = document.querySelectorAll('.gallery-pagination .page-link');
    buttons.forEach(button => {
      button.addEventListener('click', handlePaginationClick);
    });
    
    return () => {
      // Czyścimy po sobie
      buttons.forEach(button => {
        button.removeEventListener('click', handlePaginationClick);
      });
    };
  }, [visibleImages, currentPage]);  // Uruchamiamy ponownie po zmianie widocznych obrazów
  
  if (error) {
    return (
      <div id="gallery" className="text-center">
        <div className="container">
          <div className="section-title">
            <h2>Galeria</h2>
            <p>Przepraszamy, wystąpił błąd podczas ładowania galerii.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div id="gallery" className="text-center">
        <div className="container">
          <div className="section-title">
            <h2>Galeria</h2>
            <p>Ładowanie galerii...</p>
          </div>
        </div>
      </div>
    );
  }
    // Create styles for light/dark mode  // Updated styling for better blend with original design
  const darkModeStyles = {
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'initial',
    color: isDarkMode ? '#ffffff' : 'initial',
  };
  
  const headingStyles = {
    color: isDarkMode ? '#ffffff' : 'initial',
    textShadow: isDarkMode ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'initial'
  };
  
  const textStyles = {
    color: isDarkMode ? '#ffffff' : 'initial',
    textShadow: isDarkMode ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'initial'
  };
  
  return (
    <GalleryContainer id="portfolio" className="text-center gallery-section" ref={galleryRef} fontSize={fontSize} isDarkMode={isDarkMode} style={darkModeStyles}>
      <div className="container" style={darkModeStyles}>
        <div className="section-title">
          <h2 id="gallery-heading" style={headingStyles}>Galeria</h2>
          <p style={textStyles}>
            Zobacz zdjęcia z naszych działań i wydarzeń.
          </p>
        </div>
        
        <div className="gallery-container">
          <motion.div 
            className="gallery-wrapper"
            initial="hidden"
            animate="visible"
            variants={galleryVariants}
            id="gallery-container"
          >
            <div className="modern-gallery-grid" key={masonryKey}>
              {visibleImages.map((image, index) => (
                <motion.div 
                  className="gallery-item" 
                  key={`${image.title}-${index}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  layout
                >
                  <LazyImage 
                    src={image.smallImage}
                    alt={image.title || `Zdjęcie ${index + 1}`}
                    className="gallery-image"
                    onClick={() => openLightbox(image)}
                  />
                  {image.title && <h4>{image.title}</h4>}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Wskaźnik ładowania wyświetla się tylko przy pierwszym ładowaniu */}
          {loading && visibleImages.length === 0 && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Ładowanie galerii...</p>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>Przepraszamy, wystąpił błąd podczas ładowania galerii.</p>
              <button 
                className="btn btn-custom btn-lg"
                onClick={(e) => {
                  setError(false);
                  setLoading(true);
                  loadPageImages(1, e);
                }}
              >
                Spróbuj ponownie
              </button>
            </div>
          )}
            {/* Paginacja - przesunięta nad galerię dla lepszej widoczności */}
          {!loading && !error && totalPages > 0 && (
            <div className="gallery-pagination" style={darkModeStyles}>
              <ul className="pagination" style={darkModeStyles}>
                {/* Przycisk "Poprzednia" */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} style={darkModeStyles}>
                  <button 
                    className="page-link" 
                    onClick={(e) => {
                      e.preventDefault(); 
                      e.stopPropagation();
                      loadPageImages(currentPage - 1, e);
                      return false;
                    }}
                    disabled={currentPage === 1}
                    aria-label="Poprzednia strona"
                    style={{
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                      color: isDarkMode ? '#ffffff' : '#333333',
                      border: `1px solid ${isDarkMode ? '#333' : '#dee2e6'}`
                    }}
                  >
                    &laquo;
                  </button>
                </li>
                
                {/* Wyświetlanie numerów stron */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  
                  // Zawsze pokazuj pierwszą i ostatnią stronę oraz stronę aktualną i jedną sąsiednią
                  const showPageNumber = 
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                
                  // Jeśli mamy przerwę, pokaż wielokropek
                  if (!showPageNumber) {
                    // Pokaż wielokropek tylko raz dla każdej przerwy
                    if (pageNumber === 2 || pageNumber === totalPages - 1) {                      return (
                        <li key={`ellipsis-${pageNumber}`} className="page-item disabled" style={darkModeStyles}>
                          <span className="page-link" style={{
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                            color: isDarkMode ? '#ffffff' : '#333333',
                            border: `1px solid ${isDarkMode ? '#333' : '#dee2e6'}`
                          }}>...</span>
                        </li>
                      );
                    }
                    return null;
                  }
                    return (
                    <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`} style={darkModeStyles}>
                      <button 
                        className="page-link"                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          loadPageImages(pageNumber, e);
                          return false;
                        }}
                        aria-label={`Strona ${pageNumber}`}
                        aria-current={pageNumber === currentPage ? "page" : undefined}
                        style={{
                          backgroundColor: pageNumber === currentPage 
                            ? (isDarkMode ? '#42a5f5' : '#608dfd') 
                            : (isDarkMode ? '#1a1a1a' : '#f8f9fa'),
                          color: pageNumber === currentPage
                            ? (isDarkMode ? '#000000' : '#ffffff')
                            : (isDarkMode ? '#ffffff' : '#333333'),
                          border: `1px solid ${isDarkMode ? '#333' : '#dee2e6'}`
                        }}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}
                  {/* Przycisk "Następna" */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`} style={darkModeStyles}>
                  <button 
                    className="page-link" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      loadPageImages(currentPage + 1, e);
                      return false;
                    }}
                    disabled={currentPage === totalPages}
                    aria-label="Następna strona"
                    style={{
                      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                      color: isDarkMode ? '#ffffff' : '#333333',
                      border: `1px solid ${isDarkMode ? '#333' : '#dee2e6'}`
                    }}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          )}
          
          {/* Subtelny wskaźnik ładowania dla paginacji */}
          <div className={`gallery-loading-indicator ${loading ? 'visible' : ''}`}>
            <span>Ładowanie</span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        </div>
          {/* Lightbox */}
        {lightboxOpen && selectedImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)'
            }}
          >
            <div 
              className="lightbox-content" 
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: isDarkMode ? '#000000' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#333' : '#dee2e6'}`
              }}
            >
              <button 
                className="lightbox-close" 
                onClick={closeLightbox}
                style={{
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                  color: isDarkMode ? '#ffffff' : '#333333'
                }}
              >×</button>
              <button 
                className="lightbox-nav prev" 
                onClick={() => navigateImage('prev')}
                style={{
                  backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                  color: isDarkMode ? '#ffffff' : '#333333'
                }}
              >‹</button>
              <motion.img 
                src={selectedImage.largeImage} 
                alt={selectedImage.title || "Powiększone zdjęcie"}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />              <button 
                className="lightbox-nav next" 
                onClick={() => navigateImage('next')}
                style={{
                  backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                  color: isDarkMode ? '#ffffff' : '#333333'
                }}
              >›</button>              {selectedImage.title && (
                <div className="lightbox-caption" style={{
                  backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  color: isDarkMode ? '#ffffff' : '#333333'
                }}>
                  <h3 style={{ color: isDarkMode ? '#ffffff' : '#333333' }}>{selectedImage.title}</h3>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </GalleryContainer>
  );
};

export default Gallery;
