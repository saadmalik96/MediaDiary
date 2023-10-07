import { Request, RequestHandler, Response, NextFunction } from "express";
import axios from 'axios';
import MediaModel from "../models/media"
import env from "../util/validateEnv";

const TMDB_BASE_URL = env.TMDB_BASE_URL
const TMDB_TOKEN = env.TMDB_TOKEN

export const getMedia: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const media = await MediaModel.find({ type: 'movie' }).exec();
        res.status(200).json(media);    
    } catch (error) {
        next(error);
    }
};

export const getMediaDetails: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const tmdbId = req.params.tmdbId;

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
            params: {
                language: 'en-US'
            },
            headers: {
                'Authorization': TMDB_TOKEN,
                'accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        next(error);
    }
};