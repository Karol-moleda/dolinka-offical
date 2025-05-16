import React from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './features.css';

export const Features = (props) => {
  return (
    <div id="features" className="text-center">
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Aktualności</h2>
        </div>
        <div className="carousel-wrapper">
          <Carousel 
            autoPlay 
            infiniteLoop 
            showThumbs={false}
            showIndicators={false}
            showStatus={false} 
            interval={7000}
            transitionTime={1000}
            useKeyboardArrows={true}
            showArrows={true}
            renderArrowPrev={(onClickHandler, hasPrev) =>
              hasPrev && (
                <button
                  onClick={onClickHandler}
                  className="nav-arrow nav-arrow-prev"
                  aria-label="Poprzedni slajd"
                >
                  &lt;
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext) =>
              hasNext && (
                <button
                  onClick={onClickHandler}
                  className="nav-arrow nav-arrow-next"
                  aria-label="Następny slajd"
                >
                  &gt;
                </button>
              )
            }
          >
            {props.data
              ? props.data.map((d, i) => (
                  <div key={`${d.title}-${i}`} className="carousel-item">
                    {d.icon ? (
                      <i className={d.icon}></i>
                    ) : d.image ? (
                      <div className="carousel-image-box">
                        <img 
                          src={process.env.PUBLIC_URL + '/' + d.image} 
                          alt={d.title}
                        />
                      </div>
                    ) : null}
                    <h3>{d.title}</h3>
                      <p dangerouslySetInnerHTML={{__html: d.text}}></p>
                  </div>
                ))
                : "Loading..."}
          </Carousel>
        </div>
      </div>
    </div>
  );
};