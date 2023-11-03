import express from "express";
import * as MovieController from "../controllers/movie";

const router = express.Router();

router.get("/", MovieController.getMedia);

router.get('/details/:tmdbId', MovieController.getMediaDetails);

export default router;