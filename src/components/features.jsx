import React from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const Features = (props) => {
  return (
    <div id="features" className="text-center">
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Aktualności</h2>
        </div>
        <Carousel autoPlay infiniteLoop showThumbs={false} interval={5000} transitionTime={1000}>
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="carousel-content">
                  <i className={d.icon}></i>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))
            : "Loading..."}
        </Carousel>
      </div>
    </div>
  );
};