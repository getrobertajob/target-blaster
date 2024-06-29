// Imports
import { Route, Routes } from "react-router-dom";
import MainMenu from "./components/MainMenu.jsx";
import Game from "./components/Game.jsx";
import ScoreBoard from "./components/ScoreBoard.jsx";
import HowToPlay from "./components/HowToPlay.jsx";
import Admin from "./components/Admin.jsx";
import GameOver from "./components/GameOver.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<Game />} />
        <Route path="/scoreboard" element={<ScoreBoard />} />
        <Route path="/howtoplay" element={<HowToPlay />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/gameover/:score" element={<GameOver />} />
      </Routes>
    </>
  );
}


export default App;
