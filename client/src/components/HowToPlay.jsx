// imports
import React from 'react';
import { Link } from 'react-router-dom';

// declare main component
function HowToPlay() {
  return (
    <div className="howToPlay">
      <Link to="/" className="backLinkBTN">Main Menu</Link>
      <h1 className="title">How to Play</h1>
      <div className="instructionBox">
        <img className="targetTitle" src="../target.png" alt="" />
        <div className="plusSign">+</div>
        <div className="instructionStep">Left Mouse Click</div>
        <div className="equalSign">=</div>
        <div className="instructionStep">Points</div>
      </div>
      <h2 className="subtitle">Scoring System</h2>
      <div className="scoringSystemBox">
        <table className="scoringTable">
          <thead>
            <tr>
              <th>Weapon</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hand gun</td>
              <td>+1</td>
            </tr>
            <tr>
              <td>Machine gun</td>
              <td>+2</td>
            </tr>
            <tr>
              <td>Fireball
                <p>(+5 bonus damage over 5 seconds)</p>
              </td>
              <td>+3</td>
            </tr>
            <tr>
              <td>Bomb
                <p>(explodes after 2 seconds)</p>
                <p>(+5 damage per target in range)</p>
              </td>
              <td>+5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HowToPlay;
