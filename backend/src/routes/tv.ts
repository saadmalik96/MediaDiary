import express from "express";
import * as TvController from "../controllers/tv";

const router = express.Router();

router.get("/", TvController.getMedia);

router.get('/details/:tmdbId', TvController.getMediaDetails);

router.get('/ratings/:tmdbId/season/:season', TvController.getSeasonRatings);

export default router;