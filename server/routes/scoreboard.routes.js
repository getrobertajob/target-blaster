// imports
import {
    getAllScores,
    createScore,
    deleteScoreByID,
    getScoreByID,
    updateScoreByID
} from "../controllers/scoreboard.controller.js";
import { Router } from "express";

// declaring routes
const router = Router();

// routes for home page
// get all and create new
router.route('/scoreboard')
    .get( getAllScores )
    .post( createScore )

// routes for get one, update, and delete
router.route('/scoreboard/:id')
    .get ( getScoreByID )
    .put ( updateScoreByID )
    .delete ( deleteScoreByID )

    
export default router;