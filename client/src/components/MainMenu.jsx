import { Link } from "react-router-dom";

const MainMenu = () => {
  return (
    <div className="mainMenuContainer">
      <h1>Target Blaster <img className="targetTitle" src="../target.png" alt="" /></h1>
      <div className="mainMenuBox">
        <Link className="mainMenuBTN" to={`/game`}>Play game</Link>
        <Link className="mainMenuBTN" to={`/scoreboard`}>Scoreboard</Link>
        <Link className="mainMenuBTN" to={`/howtoplay`}>How to play</Link>
        <Link className="mainMenuBTN" to={`/admin`}>Admin</Link>
      </div>
    </div>
  );
};

export default MainMenu;
