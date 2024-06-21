import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const [scores, setScores] = useState([]);
  const [scoreToUpdate, setScoreToUpdate] = useState({ id: "", name: "" });

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

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8004/api/scoreboard/${id}`)
      .then((res) => {
        console.log(res.data);
        setScores(scores.filter(score => score._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (e, id) => {
    const { value } = e.target;
    setScores(scores.map(score => score._id === id ? { ...score, name: value } : score));
    setScoreToUpdate({ id, name: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8004/api/scoreboard/${scoreToUpdate.id}`, { name: scoreToUpdate.name })
      .then((res) => {
        console.log(res.data);
        alert("The scores have been saved");
        setScoreToUpdate({ id: "", name: "" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="scoreboard-container">
      <Link to="/" className="back-link">Main Menu</Link>
      <h1 className="title">Scoreboard</h1>
      <div className="scoreboard-box">
        <form onSubmit={handleSubmit} className="scoreboard-form">
          <table className="topScoresTbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr key={score._id}>
                  <td className="left-align">
                    <input type="text" id="scoreID" value={score._id} hidden />
                    <input 
                      type="text" 
                      id="scoreName" 
                      value={score.name} 
                      className="scoreNameInput"
                      onChange={(e) => handleInputChange(e, score._id)}
                    />
                  </td>
                  <td className="right-align">{score.score}</td>
                  <td>
                    <button
                      type="button"
                      className="deleteBtn"
                      onClick={() => handleDelete(score._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="button-container">
            <button type="submit" className="saveBtn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;
