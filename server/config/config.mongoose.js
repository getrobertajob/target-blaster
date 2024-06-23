import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

export const dbConnect = async () => {
  try {
    await connect(MONGODB_URI, {
      dbName: "scoreboardDB",
    });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log("DB Connection Failed: Error ----> " + error);
  }
}; 
