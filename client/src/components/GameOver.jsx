import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";

function GameOver() {
  const { score: scoreParam } = useParams();
  const [name, setName] = useState(""); // State to hold the name input by the user
  const [errors, setErrors] = useState({}); // State to hold the error messages
  const [score, setScore] = useState(parseInt(scoreParam, 10)); // State to hold the score
  const navigate = useNavigate(); // Used to navigate on successful submission

  useEffect(() => {
    validateScore(score);
  }, [score]);

  const validateScore = (score) => {
    if (score < 10) {
      setErrors(prevErrors => ({
        ...prevErrors,
        score: { message: "Minimum score is 10" }
      }));
    } else {
      setErrors(prevErrors => {
        const { score, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newScoreRecord = {
      name: name,
      score: score // Ensure the score is used directly from state
    };

    axios
      .post("https://target-blaster-server.vercel.app/api/scoreboard", newScoreRecord)
      .then((res) => {
        console.log(res.data);
        navigate("/scoreboard"); // Navigate to the scoreboard page after successful post
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          console.log(error);
        }
      });
  };

  const isScoreValid = score >= 10;

  return (
    <div className="gameOverContainer">
      <Link to="/" className="backLinkBTN">Main Menu</Link>
      <h1>Game Over</h1>
      <div className="gameOverBox">
        <form onSubmit={handleSubmit} className="gameOverForm">
          <div className="scoreDisplay">
            <label className="scoreLabel" htmlFor="score">Your Score:</label>
            <input id="score" type="text" className="scoreInput" value={score} readOnly />
            {errors.score && <p className="errorMessage">{errors.score.message}</p>}
          </div>
          <div className="nameInputContainer">
            <label htmlFor="name" className="nameLabel">Your Name:</label>
            <input
              id="name"
              type="text"
              className="nameInput"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="errorMessage">{errors.name.message}</p>}
          </div>
          <button type="submit" className="submitBTN" disabled={!isScoreValid}>Submit Score</button>
        </form>
      </div>
    </div>
  );
}

export default GameOver;
