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
    right: ${(props) => (props.position === 'left' ? '-12.5px' : 'auto')};
    left: ${(props) => (props.position === 'right' ? '-12.5px' : 'auto')};
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
      date: "13 kwietnia 2025",
      title: "Festyn Wielkanocny",
      description: "Zapraszamy na Festyn Wielkanocny! Szukanie jajek czekoladowych, występy artystyczne, warsztaty plastyczne dla dorosłych i dzieci, pyszny wielkanocny poczęstunek oraz świąteczną atmosfera🐣",
      position: "left"
    },
    {
      id: 2,
      date: "26 kwietnia 2025",
      title: "Wiosenne sprzątanie",
      description: "Zapraszamy wszystkich mieszkańców do wspólnego sprzątania naszej okolicy! To świetna okazja, by zadbać o czystość i przywitać wiosnę w pięknym otoczeniu. Razem możemy więcej! 💪♻️",
      position: "right"
    },
    {
      id: 3,
      date: "6 czerwca 2025",
      title: "Dzień dziecka",
      description: "Zapraszamy na radosny festyn z okazji Dnia Dziecka przy Szkole Podstawowej nr 10! Czeka mnóstwo atrakcji, zabaw i niespodzianek dla najmłodszych. Nie zabraknie konkursów, animacji i słodkich upominków. Spędźmy ten dzień pełen uśmiechu razem! 🎊👧🧒💖",
      position: "left"
    },
    {
      id: 4,
      date: "20 lipca 2025",
      title: "IV Turniej Siatkówki",
      description: "Zapraszamy na czwartą edycję Turnieju Siatkówki! To doskonała okazja do sportowej rywalizacji, dobrej zabawy i integracji. Nie zabraknie emocjonujących meczów, ducha fair play i pozytywnej energii. Dołącz do nas i wspólnie przeżyjmy sportowe emocje! 💪🔥",
      position: "right"
    },
    {
      id: 5,
      date: "9 sierpnia 2025",
      title: "X Kino plenerowe",
      description: "Zapraszamy na jubileuszową, dziesiątą edycję Kina Plenerowego! Czeka na Was niezapomniany seans pod gołym niebem, magiczna atmosfera i świetne kino. Weźcie koc, coś do przekąszenia i spędźmy razem wieczór pełen filmowych emocji! 🎥✨🍿",
      position: "left"
    },
    {
      id: 6,
      date: "24 sierpnia 2025",
      title: "III Turniej Koszykówki 3x3",
      description: "Zapraszamy na trzecią edycję Turnieju Koszykówki 3x3! Szybka akcja, dynamiczna gra i sportowe emocje gwarantowane. Zbierz drużynę, pokaż swoje umiejętności i walcz o zwycięstwo! Do zobaczenia na boisku! ⛹️‍♂️🏆🔥",
      position: "right"
    },
    {
      id: 7,
      date: "19 września 2025",
      title: "Biesiada(potańcówka) zakończenie lata",
      description: "Czekają na nas pieczone ziemniaki prosto z ogniska, wspólne śpiewanie i radosne spędzenie czasu w gronie sąsiadów i przyjaciół. Niech to będzie wieczór pełen ciepła, muzyki i dobrej zabawy!",
      position: "left"
    },
        {
      id: 8,
      date: "20 września 2025",
      title: "Pobiegnijmy razem-bieg osiedlowy",
      description: "Zapraszamy do udziału w sportowej zabawie dla wszystkich – bez względu na wiek i formę! Oprócz samego biegu czeka na Was mnóstwo atrakcji. To doskonała okazja, by spędzić aktywnie czas z rodziną, sąsiadami i przyjaciółmi.",
      position: "right"
    },
    {
      id: 9,
      date: "grudzień 2025",
      title: "Spotkanie Mikołajkowe",
      description: "Zapraszamy na magiczne Spotkanie Mikołajkowe! Czeka na Was świąteczna atmosfera, moc atrakcji i, oczywiście, wizyta Świętego Mikołaja! Nie zabraknie prezentów, zabaw i wspólnego kolędowania. Spędźmy razem ten wyjątkowy czas! 🎁🎶❄️",
      position: "left"
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

  return (
    <CalendarSection id="calendar">
      <CalendarContainer>
        <CalendarHeader>
          <Title>Kalendarz wydarzeń 2025</Title>
          <Subtitle>Zaplanuj swój czas z nami</Subtitle>
        </CalendarHeader>
        
        <Timeline>
          {events.map((event) => (
            <TimelineItem key={event.id} position={event.position}>
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
