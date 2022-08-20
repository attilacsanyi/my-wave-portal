import * as React from "react";
import "./App.css";

export default function App() {
  const wave = () => {};

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Welcome</div>

        <div className="bio">
          I am Attila an Angular Contractor and Web3 Enthusiast, who like doing
          sports.
        </div>

        <button className="waveButton" onClick={wave}>
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          at me
        </button>
      </div>
    </div>
  );
}
