import express from "express";
import { getUniqueGenres, getRandomMovieByGenre } from "../controllers/suggest"

const router = express.Router();

router.get('/genres', getUniqueGenres);
router.get('/movie/:genre', getRandomMovieByGenre);

export default router;
