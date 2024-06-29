// imports
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// declare main component
const Admin = () => {
  const [scores, setScores] = useState([]);
  const [scoreToUpdate, setScoreToUpdate] = useState({ id: "", name: "" });
  const [errors, setErrors] = useState({}); // State to hold the error messages for each score record

  // to query DB for data for scoreboard on page load
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

  // function fo handle delete of one record
  // recieves ID from row in table
  const handleDelete = (id) => {
    axios
      .delete(`https://target-blaster-server.vercel.app/api/scoreboard/${id}`)
      .then((res) => {
        console.log(res.data);
        setScores(scores.filter(score => score._id !== id));
        alert("The score has been removed");  // to trigger pop with save confirmation
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // function to handle changes to inputs in form
  const handleInputChange = (e, id) => {
    const { value } = e.target;
    setScores(scores.map(score => score._id === id ? { ...score, name: value } : score));
    setScoreToUpdate({ id, name: value });
  };

  // fonction to handle submit for form
  const handleSubmit = (e, id) => {
    e.preventDefault();
    const scoreRecord = scores.find(score => score._id === id);
    axios
      .put(`https://target-blaster-server.vercel.app/api/scoreboard/${id}`, { name: scoreRecord.name })
      .then((res) => {
        console.log(res.data);
        alert("The score has been saved");  // to trigger pop with save confirmation
        setScoreToUpdate({ id: "", name: "" });
        setErrors(prevErrors => ({ ...prevErrors, [id]: {} }));
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(prevErrors => ({ ...prevErrors, [id]: error.response.data.errors }));
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="scoreboardContainerAdmin">
      <Link to="/" className="backLinkBTN">Main Menu</Link>
      <h1 className="title">Scoreboard</h1>
      <div className="scoreboardBox">
        <form className="scoreboardForm">
          <table className="topScoresTable">
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
                  <td className="leftAlign">
                    <input type="text" id="scoreID" value={score._id} hidden />
                    <input
                      type="text"
                      id="scoreName"
                      value={score.name}
                      className="scoreNameInput"
                      onChange={(e) => handleInputChange(e, score._id)}
                    />
                    {errors[score._id] && errors[score._id].name && (
                      <p className="errorMessage">{errors[score._id].name.message}</p>
                    )}
                  </td>
                  <td className="rightAlign">{score.score}</td>
                  <td>
                    <button
                      type="button"
                      className="deleteBTN"
                      onClick={() => handleDelete(score._id)}>
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      type="submit"
                      className="saveBTN"
                      onClick={(e) => handleSubmit(e, score._id)}>
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default Admin;
