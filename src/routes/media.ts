import express from "express";
import * as MediaController from "../controllers/media";

const router = express.Router();

router.get('/search/:query/:page', MediaController.searchTMDB);

router.post("/", MediaController.saveMedia);

export default router;