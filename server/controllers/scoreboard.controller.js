// imports
import Scoreboard from "../models/scoreboard.model.js";

// function to get all records
// includes order by decending by score
export const getAllScores = async (req, res) => {
  try {
    const scores = await Scoreboard.find().sort({ score: -1 });
    res.status(200).json(scores);
  } catch (error) {
    res.status(400).json(error);
  }
};

// function to create new record
export const createScore = async (req, res) => {
  try {
    const score = await Scoreboard.create(req.body);
    res.status(201).json(score);
  } catch (error) {
    res.status(400).json(error);
  }
};

// function to get one by ID
export const getScoreByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const score = await Scoreboard.findById(id);
    res.status(200).json(score);
  } catch (error) {
    res.status(400).json(error);
  }
};

//function to update one by ID
export const updateScoreByID = async (req, res, next) => {
  const { id } = req.params;
  const options = {
    new: true,
    runValidators: true,
  };
  try {
    const updated = await Scoreboard.findByIdAndUpdate(id, req.body, options);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json(error);
  }
};

// function to delete one by ID
export const deleteScoreByID = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await Scoreboard.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json(error);
  }
};
