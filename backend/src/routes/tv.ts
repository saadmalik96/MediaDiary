import express from "express";
import * as TvController from "../controllers/tv";

const router = express.Router();

router.get("/", TvController.getMedia);

router.get('/details/:tmdbId', TvController.getMediaDetails);

export default router;