import React from "react";
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilePdf } from '@fortawesome/free-solid-svg-icons';

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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const DocumentCard = styled.a`
  display: block;
  background: ${props => props.$isDarkMode ? '#34495e' : '#fff'};
  padding: 30px 25px;
  border-radius: 10px;
  box-shadow: ${props => props.$isDarkMode ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)'};
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
  
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

  const documents = [
    {
      name: "Kwestionariusz drużyny 2025",
      filename: "Kwestionariusz drużyny 2025.pdf",
      description: "Formularz rejestracyjny dla drużyn uczestniczących w turnieju"
    },
    {
      name: "Regulamin Turnieju w Dolince 2025",
      filename: "Regulamin Turnieju_w_Dolince_2025.pdf",
      description: "Oficjalny regulamin turnieju organizowanego w Dolince"
    },
    {
      name: "Zgłoszenie dla osoby niepełnoletniej",
      filename: "Zgłoszenie i ośw. dla osoby niepełnoletniej.pdf",
      description: "Formularz zgłoszeniowy wraz z oświadczeniem dla osób niepełnoletnich"
    },
    {
      name: "Zgłoszenie dla osoby pełnoletniej",
      filename: "Zgłoszenie i ośw. dla osoby pełnoletniej.pdf",
      description: "Formularz zgłoszeniowy wraz z oświadczeniem dla osób pełnoletnich"
    }
  ];

  return (
    <InneSection id="inne" $isDarkMode={isDarkMode}>
      <Container>
        <SectionHeader>
          <Title $isDarkMode={isDarkMode}>Dokumenty do pobrania</Title>
          <Description $isDarkMode={isDarkMode}>
            Oficjalne dokumenty, formularze i regulaminy stowarzyszenia
          </Description>
        </SectionHeader>
        
        <ContentGrid>
          {documents.map((doc, index) => (
            <DocumentCard 
              key={index}
              href={`${process.env.PUBLIC_URL}/document/${encodeURIComponent(doc.filename)}`}
              download={doc.filename}
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
                <DownloadButton>
                  <FontAwesomeIcon icon={faDownload} />
                  Pobierz
                </DownloadButton>
              </DocumentMeta>
            </DocumentCard>
          ))}
        </ContentGrid>
      </Container>
    </InneSection>
  );
};

export default Inne;
