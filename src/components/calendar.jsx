import React from "react";
import styled from "styled-components";
import wydarzenia from "../content/kalendarz.json";

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
  background-color: ${props => props.$isPast ? '#e0e0e0' : 'white'};
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

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// Ostatni dzien miesiaca danej daty. Uzywany dla wydarzen z przyblizonym
// terminem ("wrzesien 2026") - takie nie powinno stac sie "minione" 2 wrzesnia.
const endOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

const Calendar = () => {
  const today = new Date();

  // Tresc pochodzi z src/content/kalendarz.json - w kodzie nie ma zadnych wydarzen.
  const events = (wydarzenia.wydarzenia || [])
    .filter((event) => event.published !== false)
    .map((event) => {
      const parsed = new Date(`${event.date}T00:00:00`);
      const isValid = !Number.isNaN(parsed.getTime());
      const isApproximate = Boolean(event.dateText);

      return {
        ...event,
        parsedDate: isValid ? parsed : null,
        // Przy przyblizonym terminie pokazujemy tekst wpisany recznie,
        // w pozostalych przypadkach date formatowana po polsku.
        label: isApproximate
          ? event.dateText
          : (isValid ? dateFormatter.format(parsed) : event.date),
        isPast: isValid
          ? (isApproximate ? endOfMonth(parsed) : parsed) < today
          : false,
      };
    })
    // Kolejnosc wynika z daty, a nie z kolejnosci wpisow w pliku.
    .sort((left, right) => {
      if (!left.parsedDate) return 1;
      if (!right.parsedDate) return -1;
      return left.parsedDate - right.parsedDate;
    });

  // Rok w naglowku wynika z dat wydarzen, nie z recznie wpisanej liczby.
  const years = [...new Set(
    events.filter((event) => event.parsedDate).map((event) => event.parsedDate.getFullYear())
  )].sort((a, b) => a - b);

  const calendarYear = years.length
    ? (years.length > 1 ? `${years[0]}\u2013${years[years.length - 1]}` : String(years[0]))
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
            <TimelineItem
              key={`${event.date}-${event.title}`}
              $position={index % 2 === 0 ? 'left' : 'right'}
            >
              <EventCard $isPast={event.isPast}>
                <EventDate>{event.label}</EventDate>
                <EventTitle>{event.title}</EventTitle>
                <EventDescription>{event.text}</EventDescription>
              </EventCard>
            </TimelineItem>
          ))}
        </Timeline>
      </CalendarContainer>
    </CalendarSection>
  );
};

export default Calendar;
