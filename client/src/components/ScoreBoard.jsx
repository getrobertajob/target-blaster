import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios
      .get("https://target-blaster-server.vercel.app/api/scoreboard")
      .then((res) => {
        console.log(res.data);
        setScores(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="scoreboardContainerRead">
      <Link to="/" className="backLinkBTN">Main Menu</Link>
      <h1 className="title">Scoreboard</h1>
      <div className="scoreboardBoxRead">
        <table className="topScoresTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody className="scoreboardBody">
            {scores.map((score) => (
              <tr key={score._id}>
                <td className="leftAlign">{score.name}</td>
                <td className="rightAlign">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scoreboard;
