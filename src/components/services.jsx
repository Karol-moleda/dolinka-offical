import React from "react";

export const Services = (props) => {
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Nasze Wydarzenia</h2>
          <p>
          Jako Zarząd Osiedla Młodych organizujemy liczne wydarzenia, które mają na celu łączyć pokolenia – zarówno starszych, jak i młodszych mieszkańców. Tworzymy okazje do wspólnej zabawy, integracji i budowania więzi sąsiedzkich, by nasze osiedle tętniło życiem i było miejscem przyjaznym dla wszystkich!
          </p>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4">
                  {" "}
                  <img src={d.img} alt="..." className="service-img" />
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
