import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8004/api/scoreboard")
      .then((res) => {
        console.log(res.data);
        setScores(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  return (
    <div className="scoreboard-container">
      <Link to="/" className="back-link">Main Menu</Link>
      <h1 className="title">Scoreboard</h1>
      <div className="scoreboard-box">
        <table className="topScoresTbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score._id}>
                <td className="left-align">{score.name}</td>
                <td className="right-align">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scoreboard;
