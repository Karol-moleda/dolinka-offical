import React, { useState } from "react";
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilePdf, faVolleyballBall, faBasketballBall, faRunning } from '@fortawesome/free-solid-svg-icons';

const InneSection = styled.section`
  padding: 100px 0;
  background: ${props => props.$isDarkMode ? '#2c3e50' : '#f8f9fa'};
  color: ${props => props.$isDarkMode ? '#fff' : '#333'};
  transition: all 0.3s ease;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
`;

const Title = styled.h2`
  font-size: 42px;
  font-weight: 300;
  margin-bottom: 20px;
  color: ${props => props.$isDarkMode ? '#fff' : '#333'};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #3498db;
  }
`;

const Description = styled.p`
  font-size: 18px;
  color: ${props => props.$isDarkMode ? '#bdc3c7' : '#666'};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0;
  background: ${props => props.$isDarkMode ? '#34495e' : '#f8f9fa'};
  border-radius: 15px;
  padding: 8px;
  max-width: 500px;
  margin: 40px auto;
  box-shadow: ${props => props.$isDarkMode ? '0 4px 15px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.1)'};
  gap: 8px;
  overflow-x: auto; /* allow scrolling when tabs overflow */
  -webkit-overflow-scrolling: touch;

  /* hide native scrollbar on WebKit */
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 800px) {
    display: none; /* hide tabs on smaller screens, use select instead */
    padding: 6px;
    max-width: calc(100% - 32px);
  }
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px 25px;
  background: ${props => props.$active ? '#3498db' : 'transparent'};
  color: ${props => props.$active ? '#fff' : (props.$isDarkMode ? '#bdc3c7' : '#666')};
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: ${props => props.$active ? '#2980b9' : (props.$isDarkMode ? '#2c3e50' : '#e9ecef')};
    color: ${props => props.$active ? '#fff' : (props.$isDarkMode ? '#fff' : '#333')};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }

  /* Mobile adjustments */
  @media (max-width: 600px) {
    padding: 10px 14px;
    font-size: 14px;
    flex: 0 0 auto; /* don't stretch, allow horizontal scroll */
    min-width: 110px;
  }
`;

const TabIcon = styled(FontAwesomeIcon)`
  font-size: 18px;
`;

/* Mobile select that replaces tabs on small screens */
const TabsSelect = styled.select`
  display: none;
  width: 100%;
  max-width: 520px;
  margin: 16px auto 24px auto;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${props => props.$isDarkMode ? '#2c3e50' : '#ddd'};
  background: ${props => props.$isDarkMode ? '#34495e' : '#fff'};
  color: ${props => props.$isDarkMode ? '#fff' : '#333'};
  font-weight: 600;
  font-size: 16px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  @media (max-width: 800px) {
    display: block;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const DocumentCard = styled.div`
  display: block;
  background: ${props => props.$isDarkMode ? '#34495e' : '#fff'};
  padding: 30px 25px;
  border-radius: 10px;
  box-shadow: ${props => props.$isDarkMode ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)'};
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.$isDarkMode ? '0 15px 35px rgba(0,0,0,0.4)' : '0 15px 35px rgba(0,0,0,0.2)'};
    border-color: #3498db;
    text-decoration: none;
    color: inherit;
  }
`;

const DocumentIcon = styled.div`
  font-size: 48px;
  color: #e74c3c;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const DocumentTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${props => props.$isDarkMode ? '#fff' : '#333'};
  line-height: 1.4;
`;

const DocumentMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${props => props.$isDarkMode ? '#bdc3c7' : '#666'};
  font-size: 14px;
  margin-top: 15px;
`;

const DownloadButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #3498db;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #2980b9;
  }
`;

const CardText = styled.p`
  font-size: 16px;
  color: ${props => props.$isDarkMode ? '#bdc3c7' : '#666'};
  line-height: 1.6;
`;

const Inne = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('run');

  // Funkcja pobierania dokumentu
  const handleDownload = (doc, tournament) => {
    const filename = doc.filename;
    const originalFilename = doc.originalFilename || doc.filename;
    // For basketball files are in /document/kos/, for others in /document/
    const folderPath = tournament === 'basketball' ? '/document/kos/' : '/document/';
    const fileURL = `${window.location.origin}${folderPath}${filename}`;
    
    try {
      // Tworzymy tymczasowy link, klikamy go i usuwamy
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', originalFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Błąd podczas pobierania:', error);
    }
  };
  
  const runDocuments = [
    {
      name: "Regulamin Biegu 2025",
      filename: "run2025.pdf",
      originalFilename: "run2025.pdf",
      description: "Oficjalny regulamin biegu organizowanego w Dolince"
    }
  ];

  const volleyballDocuments = [
    {
      name: "Kwestionariusz drużyny 2025",
      filename: "Kwe_2025.pdf",
      originalFilename: "Kwestionariusz drużyny 2025.pdf",
      description: "Formularz rejestracyjny dla drużyn uczestniczących w turnieju siatkówki"
    },
    {
      name: "Regulamin Turnieju w Dolince 2025",
      filename: "Regulamin_2025.pdf",
      originalFilename: "Regulamin Turnieju w Dolince 2025.pdf",
      description: "Oficjalny regulamin turnieju siatkówki organizowanego w Dolince"
    },
    {
      name: "Zgłoszenie dla osoby niepełnoletniej",
      filename: "Niepelnoletnia_2025.pdf",
      originalFilename: "Zgłoszenie dla osoby niepełnoletniej.pdf",
      description: "Formularz zgłoszeniowy wraz z oświadczeniem dla osób niepełnoletnich"
    },
    {
      name: "Zgłoszenie dla osoby pełnoletniej",
      filename: "Pelnoletnia_2025.pdf",
      originalFilename: "Zgłoszenie dla osoby pełnoletniej.pdf",
      description: "Formularz zgłoszeniowy wraz z oświadczeniem dla osób pełnoletnich"
    }
  ];

  const basketballDocuments = [
    {
      name: "Kwestionariusz drużyny 2025",
      filename: "druzyna-2025.pdf",
      originalFilename: "Kwestionariusz drużyny koszykówka 2025.pdf",
      description: "Formularz rejestracyjny dla drużyn uczestniczących w turnieju koszykówki"
    },
    {
      name: "Regulamin Turnieju Koszykówki 2025",
      filename: "regulamin-2025.pdf",
      originalFilename: "Regulamin Turnieju Koszykówki 2025.pdf",
      description: "Oficjalny regulamin turnieju koszykówki organizowanego w Dolince"
    },
    {
      name: "Zgłoszenie dla osoby niepełnoletniej",
      filename: "niepelnoletni-2025.pdf",
      originalFilename: "Zgłoszenie dla osoby niepełnoletniej koszykówka.pdf",
      description: "Formularz zgłoszeniowy wraz z oświadczeniem dla osób niepełnoletnich"
    },
    {
      name: "Zgłoszenie dla osoby pełnoletniej",
      filename: "Pelnoletnia_2025.pdf",
      originalFilename: "Zgłoszenie dla osoby pełnoletniej koszykówka.pdf",
      description: "Formularz zgłoszeniowy wraz z oświadczeniem dla osób pełnoletnich"
    }
  ];

  const currentDocuments = activeTab === 'basketball' ? basketballDocuments : (activeTab === 'run' ? runDocuments : volleyballDocuments);

  return (
    <InneSection id="inne" $isDarkMode={isDarkMode}>
      <Container>
        <SectionHeader>
          <Title $isDarkMode={isDarkMode}>Dokumenty do pobrania</Title>
          <Description $isDarkMode={isDarkMode}>
            Oficjalne dokumenty, formularze i regulaminy stowarzyszenia
          </Description>
        </SectionHeader>
        
        <TabsSelect $isDarkMode={isDarkMode} value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
          <option value="basketball">Koszykówka</option>
          <option value="volleyball">Siatkówka</option>
          <option value="run">Bieg</option>
        </TabsSelect>

        <TabsContainer $isDarkMode={isDarkMode}>
          <Tab 
            $active={activeTab === 'run'} 
            $isDarkMode={isDarkMode}
            onClick={() => setActiveTab('run')}
          >
            <TabIcon icon={faRunning} />
            Bieg
          </Tab>
          <Tab 
            $active={activeTab === 'basketball'} 
            $isDarkMode={isDarkMode}
            onClick={() => setActiveTab('basketball')}
          >
            <TabIcon icon={faBasketballBall} />
            Koszykówka
          </Tab>
          <Tab 
            $active={activeTab === 'volleyball'} 
            $isDarkMode={isDarkMode}
            onClick={() => setActiveTab('volleyball')}
          >
            <TabIcon icon={faVolleyballBall} />
            Siatkówka
          </Tab>
        </TabsContainer>
        
        <ContentGrid>
          {currentDocuments.map((doc, index) => (
            <DocumentCard 
              key={index}
              $isDarkMode={isDarkMode}
            >
              <DocumentIcon>
                <FontAwesomeIcon icon={faFilePdf} />
              </DocumentIcon>
              <DocumentTitle $isDarkMode={isDarkMode}>
                {doc.name}
              </DocumentTitle>
              <CardText $isDarkMode={isDarkMode}>
                {doc.description}
              </CardText>
              <DocumentMeta $isDarkMode={isDarkMode}>
                <div 
                  onClick={() => handleDownload(doc, activeTab)}
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  <DownloadButton>
                    <FontAwesomeIcon icon={faDownload} />
                    Pobierz
                  </DownloadButton>
                </div>
              </DocumentMeta>
            </DocumentCard>
          ))}
        </ContentGrid>
      </Container>
    </InneSection>
  );
};

export default Inne;
