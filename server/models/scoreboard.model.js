import { model, Schema } from "mongoose"

const ScoreboardDB = new Schema(
    {
        name : {
            type : String,
            required : [ true, "Name is required" ],
            minLength : [ 2, "Name must be 2 characters"],
            maxLength : [ 20, "Name max is 20 characters"]
        }, 
        score : {
            type : Number,
            min : [ 10, "Minimum score is 10"]
        }
    }, 
    { timestamps : true}
)

const Scoreboard = model('Scoreboard', ScoreboardDB)
export default Scoreboard