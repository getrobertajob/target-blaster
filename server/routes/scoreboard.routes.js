import {
    getAllScores,
    createScore,
    deleteScoreByID,
    getScoreByID,
    updateScoreByID
} from "../controllers/scoreboard.controller.js";
import { Router } from "express";

const router = Router();

router.route('/scoreboard')
    .get( getAllScores )
    .post( createScore )

router.route('/scoreboard/:id')
    .get ( getScoreByID )
    .put ( updateScoreByID )
    .delete ( deleteScoreByID )

    
export default router;