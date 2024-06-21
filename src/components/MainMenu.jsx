// src/MainMenu.jsx
// import React from 'react';
import { Link } from "react-router-dom";
// import { useHistory } from 'react-router-dom';

const MainMenu = () => {
  // const history = useHistory();

  return (
    <div className="mainMenuContainer">

      <h1>Target Blaster <img className="targetTitle" src="/target-blaster/target.png" alt="" /></h1>
      <div className="mainMenuBox">
        <Link className="mainMenuBtn" to={`/game`}>Play game</Link>
        <Link className="mainMenuBtn" to={`/scoreboard`}>Scoreboard</Link>
        <Link className="mainMenuBtn" to={`/howtoplay`}>How to play</Link>
        <Link className="mainMenuBtn" to={`/admin`}>Admin</Link>
      </div>
    </div>
  );
};

export default MainMenu;
