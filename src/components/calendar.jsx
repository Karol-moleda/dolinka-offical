import React from "react";
import styled from "styled-components";

const CalendarSection = styled.div`
  padding: 100px 0;
  background: ${(props) => props.theme.background || "#f6f6f6"};
  color: ${(props) => props.theme.color || "#333"};
`;

const CalendarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
`;

const CalendarHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
`;

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    background-color: #006400;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -3px;
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    
    &::after {
      left: 31px;
      margin-left: 0;
    }
  }
`;

const TimelineItem = styled.div`
  padding: 10px 40px;
  position: relative;
  width: 50%;
  box-sizing: border-box;
  margin-bottom: 30px;
  
  &:nth-child(odd) {
    left: 0;
    text-align: right;
  }
  
  &:nth-child(even) {
    left: 50%;
    text-align: left;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    right: ${(props) => (props.$position === 'left' ? '-12.5px' : 'auto')};
    left: ${(props) => (props.$position === 'right' ? '-12.5px' : 'auto')};
    background-color: #006400;
    border: 4px solid #4CAF50;
    top: 15px;
    border-radius: 50%;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    width: calc(100% - 70px);
    padding: 10px 20px;
    left: 70px !important;
    text-align: left !important;
    
    &::after {
      left: -43px !important;
      right: auto !important;
      width: 20px;
      height: 20px;
    }
  }
`;

const EventCard = styled.div`
  padding: 20px;
  background-color: ${props => props.isPast ? '#e0e0e0' : 'white'};
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const EventDate = styled.div`
  color: #006400;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 18px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const EventTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 22px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const EventDescription = styled.p`
  margin: 0;
  color: #666;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Calendar = () => {
  const events = [
    {
      id: 1,
      date: "29 marca 2026",
      title: "Festyn Wielkanocny",
      description: "Zapraszamy na Festyn Wielkanocny! Szukanie jajek czekoladowych, występy artystyczne, warsztaty plastyczne dla dorosłych i dzieci, pyszny wielkanocny poczęstunek oraz świąteczna atmosfera 🐣"
    },
    {
      id: 2,
      date: "2 maja 2026",
      title: "Piknik Patriotyczny",
      description: "Świętujmy razem majówkę! Zapraszamy na Piknik Patriotyczny z atrakcjami dla całych rodzin, wspólnym śpiewaniem pieśni patriotycznych i grochówką. Pokażmy naszą dumę i radość ze wspólnoty! 🇵🇱"
    },
    {
      id: 3,
      date: "24 maja 2026",
      title: "Festiwal Dmuchańców",
      description: "Prawdziwe szaleństwo dla najmłodszych! Wielki Festiwal Dmuchańców to dzień pełen skakania, zjeżdżania i niesamowitej zabawy. Gwarantujemy uśmiech na twarzy każdego dziecka! 🏰🎈"
    },
    {
      id: 4,
      date: "15 sierpnia 2026",
      title: "Kino Plenerowe",
      description: "Magia kina pod gwiazdami powraca! Zabierzcie koce i leżaki, by wspólnie obejrzeć filmowy hit tego lata. Niezapomniana atmosfera i popcorn gratis! 🎬🍿🌌"
    },
    {
      id: 5,
      date: "26 lipca 2026",
      title: "Turniej Siatkówki",
      description: "Sportowe emocje na piasku! Zapraszamy drużyny i kibiców na Turniej Siatkówki. Czeka nas rywalizacja w duchu fair play, słońce i świetna zabawa. Dołącz do gry! 🏐☀️"
    },
    {
      id: 6,
      date: "23 sierpnia 2026",
      title: "Turniej Koszykówki 3x3",
      description: "Streetball w najlepszym wydaniu!Turniej Koszykówki 3x3 to szybkość, technika i walka pod koszem. Zbierz ekpię i walcz o puchar Dolinki! 🏀🏆"
    },
    {
      id: 7,
      date: "wrzesień 2026",
      title: "Zebranie Ogólne i Potańcówka",
      description: "Ważne sprawy i wspólna zabawa. Zapraszamy na zebranie ogólne mieszkańców, po którym zintegrujemy się podczas jesiennej potańcówki. Wasz głos i obecność są dla nas ważne! 🗣️🍂💃"
    },
    {
      id: 8,
      date: "grudzień 2026",
      title: "Mikołajki",
      description: "Ho, ho, ho! Święty Mikołaj odwiedzi Dolinkę! Zapraszamy wszystkie dzieci na spotkanie z Mikołajem, prezenty i wspólne kolędowanie. Poczujmy magię Świąt! 🎅🎄🎁"
    },
  ];

  // Function to check if an event date has passed
  const isEventPast = (dateString) => {
    const today = new Date();
    
    // Handle different date formats
    if (dateString.includes("grudzień") && dateString.includes("2025")) {
      // December 2025 - create date for December 1, 2025
      return new Date(2025, 11, 1) < today;
    } else if (dateString.includes("koniec sierpnia") || dateString.includes("początek września")) {
      // End of August / beginning of September - use September 1, 2025
      return new Date(2025, 8, 1) < today;
    } else {
      // Parse specific dates like "13 kwietnia 2025"
      const months = {
        "stycznia": 0, "lutego": 1, "marca": 2, "kwietnia": 3, "maja": 4, "czerwca": 5, 
        "lipca": 6, "sierpnia": 7, "września": 8, "października": 9, "listopada": 10, "grudnia": 11
      };
      
      // Extract date components
      const parts = dateString.split(" ");
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = months[parts[1]];
        const year = parseInt(parts[2], 10);
        
        if (!isNaN(day) && month !== undefined && !isNaN(year)) {
          return new Date(year, month, day) < today;
        }
      }
      
      // Default to future if we can't parse the date
      return false;
    }
  };

  // Rok w nagłówku wynika z dat wydarzeń, nie z ręcznie wpisanej liczby.
  // Jeśli wydarzenia obejmują dwa lata, pokazujemy zakres (np. "2026–2027").
  const years = [...new Set(
    events
      .map((event) => event.date.match(/\b(20\d{2})\b/))
      .filter(Boolean)
      .map((match) => Number(match[1]))
  )].sort((a, b) => a - b);

  const calendarYear = years.length
    ? (years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : String(years[0]))
    : new Date().getFullYear();

  return (
    <CalendarSection id="calendar">
      <CalendarContainer>
        <CalendarHeader>
          <Title>Kalendarz wydarzeń {calendarYear}</Title>
          <Subtitle>Zaplanuj swój czas z nami</Subtitle>
        </CalendarHeader>
        
        <Timeline>
          {events.map((event, index) => (
            <TimelineItem key={event.id} $position={index % 2 === 0 ? 'left' : 'right'}>
              <EventCard isPast={isEventPast(event.date)}>
                <EventDate>{event.date}</EventDate>
                <EventTitle>{event.title}</EventTitle>
                <EventDescription>{event.description}</EventDescription>
              </EventCard>
            </TimelineItem>
          ))}
        </Timeline>
      </CalendarContainer>
    </CalendarSection>
  );
};

export default Calendar;
