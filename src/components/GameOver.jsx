import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

function GameOver() {
  const { score } = useParams();
  const [name, setName] = useState(""); // State to hold the name input by the user
  const navigate = useNavigate(); // Used to navigate on successful submission

  const handleSubmit = (event) => {
    event.preventDefault();
    const newScoreRecord = {
      name: name,
      score: parseInt(score, 10) // Ensure the score is an integer as expected by the model
    };

    axios
      .post("http://localhost:8004/api/scoreboard", newScoreRecord)
      .then((res) => {
        console.log(res.data);
        // alert("Your score have been saved");
        navigate("/scoreboard"); // Navigate to the scoreboard page after successful post
      })
      .catch((error) => {
        console.error('Error posting score:', error.response.data);
        // Optionally update state with errors to display in the UI
      });
  };

  return (
    <div className="game-over-container">
      <h1>Game Over</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Score:</label>
          <input type="text" value={score} readOnly />
        </div>
        <div>
          <label htmlFor="name">Your Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Score</button>
      </form>
    </div>
  );
}

export default GameOver;
