import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnect } from "./config/config.mongoose.js";
import router from "./routes/scoreboard.routes.js";

dotenv.config();
dbConnect();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

// Add a route to display "server is running"
app.get('/', (req, res) => {
    res.send("server is running.");
});

app.listen(process.env.PORT, () => {
    console.log("Listening on port: " + process.env.PORT);
});
