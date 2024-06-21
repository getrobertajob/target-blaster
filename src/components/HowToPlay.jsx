import React from 'react';
import { Link } from 'react-router-dom';


function HowToPlay() {
  return (
    <div className="how-to-play">
      <Link to="/" className="back-link">Main Menu</Link>
      <h1 className="title">How to Play</h1>
      <div className="instruction-box">
        {/* <img src="/path/to/image.png" alt="Example" className="example-image" /> */}
        <img className="targetTitle" src="/target-blaster/target.png" alt="" />
        <div className="plus-sign">+</div>
        <div className="instruction-step">Left Mouse Click</div>
        <div className="equal-sign">=</div>
        <div className="instruction-step">Points</div>
      </div>
      <h2 className="subtitle">Scoring System</h2>
      <div className="scoring-system-box">
        <table className="scoring-table">
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
                {/* <p>(waits 2 seconds then explodes)</p> */}
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
