import React from "react";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

const TeamContainer = styled.div`
  background-color: ${(props) => (props.isDarkMode ? "#000000" : "#ffffff")};

  .section-title {
    h2 {
      font-size: calc(${(props) => props.fontSize}px * 1.5);
      color: ${(props) => (props.isDarkMode ? "#ffffff" : "#2c3e50")};
    }
    p {
      font-size: inherit;
      color: ${(props) => (props.isDarkMode ? "#ffffff" : "#333333")};
    }
  }

  .thumbnail {
    background-color: ${(props) => (props.isDarkMode ? "#1a1a1a" : "#ffffff")};
    border: 1px solid ${(props) => (props.isDarkMode ? "#333" : "#e9ecef")};
  }

  .caption {
    h4 {
      font-size: calc(${(props) => props.fontSize}px * 1.1);
      color: ${(props) => (props.isDarkMode ? "#ffffff" : "#333333")};
    }
    p {
      font-size: inherit;
      color: ${(props) => (props.isDarkMode ? "#ffffff" : "#333333")};
    }
  }
`;

export const Team = (props) => {
  const { fontSize, isDarkMode } = useTheme();

  return (
    <div style={{ backgroundColor: isDarkMode ? "#000000" : "#ffffff" }}>
      <TeamContainer
        fontSize={fontSize}
        isDarkMode={isDarkMode}
        id="team"
        className="text-center"
      >
        <div className="container">
          <div className="col-md-8 col-md-offset-2 section-title">
            <h2>Zarząd Osiedla Młodych</h2>
            <p>Poznaj nas</p>
          </div>
          <div id="row" className="flex-row">
            {props.data
              ? props.data.map((d, i) => (
                  <div key={`${d.name}-${i}`} className="team">
                    <div className="thumbnail">
                      {" "}
                      <img
                        src={process.env.PUBLIC_URL + "/" + d.img}
                        alt={d.img}
                        className="team-img"
                      />
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
      </TeamContainer>
    </div>
  );
};

export default Team;
