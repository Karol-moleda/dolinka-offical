import { Image } from "./image";
import React from "react";
import Masonry from 'react-masonry-css';

export const Gallery = (props) => {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div id="portfolio" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Zdjęcia</h2>
          <p>
            Zarząd Osiedla Młodych w akcji – Zobacz, jak wspólnie działamy, organizujemy i bawimy się podczas naszych osiedlowych wydarzeń!
          </p>
        </div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`}>
                  <Image
                    title={d.title}
                    largeImage={d.largeImage}
                    smallImage={d.smallImage}
                  />
                </div>
              ))
            : "Loading..."}
        </Masonry>
      </div>
    </div>
  );
};
