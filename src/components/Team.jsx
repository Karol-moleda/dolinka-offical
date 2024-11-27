import React from "react";

export const Team = (props) => {
  return (
    <div id="team" className="text-center">
      <div className="container">
        <div className="col-md-8 col-md-offset-2 section-title">
          <h2>Zarząd Osiedla Młodych</h2>
          <p>
            Poznaj nas
          </p>
        </div>
        <div id="row" className="flex-row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="team">
                  <div className="thumbnail">
                    {" "}
                    <img src={process.env.PUBLIC_URL + '/' +  d.img} alt={d.img} className="team-img" />
                    <div className="caption">
                      <h4>{d.name}</h4>
                      <p>{d.job}</p>
                    </div>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
