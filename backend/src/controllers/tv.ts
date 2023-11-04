import { Request, RequestHandler, Response, NextFunction } from "express";
import axios from 'axios';
import MediaModel from "../models/media"
import env from "../util/validateEnv";

const TMDB_BASE_URL = env.TMDB_BASE_URL
const TMDB_TOKEN = env.TMDB_TOKEN
const OMDB_API_KEY = env.OMDB_API_KEY
const OMDB_BASE_URL = env.OMDB_BASE_URL

export const getMedia: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any)._id; 
        const media = await MediaModel.find({ type: 'tv', user: userId }).exec();
        res.status(200).json(media);    
    } catch (error) {
        next(error);
    }
};

export const getMediaDetails: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const tmdbId = req.params.tmdbId;

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/${tmdbId}`, {
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

export const getSeasonRatings: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { tmdbId, season } = req.params;
    try {
        const media = await MediaModel.findOne({ tmdbId: tmdbId }).exec();

        if (!media || !media.imdbID) {
            return res.status(404).json({ message: "IMDb ID not found for the given TMDB ID" });
        }

        const omdbResponse = await axios.get(`${OMDB_BASE_URL}`, {
            params: {
                apikey: OMDB_API_KEY,
                i: media.imdbID,
                Season: season
            }
        });

        // Check if the response is successful
        if (omdbResponse.data.Response === "True") {
            const episodes = omdbResponse.data.Episodes.map((episode: any) => ({
                title: episode.Title,
                released: episode.Released,
                episodeNumber: episode.Episode,
                imdbRating: episode.imdbRating,
                imdbID: episode.imdbID
            }));

            res.json(episodes);
        } else {
            // OMDB API does not return a successful response
            res.status(404).json({ message: "Season details not found" });
        }
    } catch (error) {
        next(error);
    }
};
