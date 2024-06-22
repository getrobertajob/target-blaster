import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

function GameOver() {
  const { score } = useParams();
  const [name, setName] = useState(""); // State to hold the name input by the user
  const navigate = useNavigate(); // Used to navigate on successful submission

  const handleSubmit = (e) => {
    e.preventDefault();
    const newScoreRecord = {
      name: name,
      score: parseInt(score, 10) // Ensure the score is an integer as expected by the model
    };

    axios
      .post("http://localhost:8004/api/scoreboard", newScoreRecord)
      .then((res) => {
        console.log(res.data);
        navigate("/scoreboard"); // Navigate to the scoreboard page after successful post
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="gameOverContainer">
      <h1>Game Over</h1>
      <div className="gameOverBox">
        <form onSubmit={handleSubmit} className="gameOverForm">
          <div className="scoreDisplay">
            <label className="scoreLabel">Your Score:</label>
            <input className="scoreInput" type="text" value={score} readOnly />
          </div>
          <div className="nameInputContainer">
            <label htmlFor="name" className="nameLabel">Your Name:</label>
            <input
              id="name"
              type="text"
              className="nameInput"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submitBTN">Submit Score</button>
        </form>
      </div>
    </div>
  );
}

export default GameOver;
