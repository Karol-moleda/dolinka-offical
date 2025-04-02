import React from "react";

export const Contact = (props) => {
  
  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Kontakt</h2>
                <p>
                  Jeśli masz ochotę spotkać się, porozmawiać, podzielić się swoimi pomysłami lub po prostu lepiej nas poznać – serdecznie zapraszamy do kontaktu! Jesteśmy otwarci na wszelkie sugestie, pytania i inicjatywy. Razem możemy tworzyć jeszcze lepsze miejsce do życia, więc nie wahaj się do nas zgłosić!
                </p>
              </div>
              <div className="section-title">
                <h2>Telefony</h2>
                <p>
                <i className="fa fa-phone"></i> 32 6260100 - Urząd Miasta w Olkuszu <br />
                <i className="fa fa-phone"></i> 112 - numer służy do powiadamiania w sytuacjach zagrożenia zdrowia, życia lub mienia <br />
                <i className="fa fa-phone"></i> 999 - Pogotowie Ratunkowe <br />
                <i className="fa fa-phone"></i> 998 - Straż Pożarna <br />
                <i className="fa fa-phone"></i> 997 - Policja <br />
                <i className="fa fa-phone"></i> 986 - Straż Miejska <br />
                </p>
              </div>
              <div className="section-title">
                <h2>Strony</h2>
                <p>
                  <a href="https://umig.olkusz.pl/" target="_blank" rel="noopener noreferrer">
                    Urząd miasta
                  </a> <br />
                  <a href="https://www.sp.olkusz.pl/" target="_blank" rel="noopener noreferrer">
                    Starostwo Powiatowe
                  </a> <br />
                  <a href="http://www.osm.olkusz.pl//" target="_blank" rel="noopener noreferrer">
                    Olkuska Spóldzielnia mieszkaniowa
                  </a> <br />
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-md-offset-1 contact-info">
            <div className="contact-item">
              <h3>Informacje kontaktowe</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Adres
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Przewodniczacy Osiedla Młodych - 789 595 848
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"}>
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
