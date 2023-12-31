import { Request, RequestHandler, Response, NextFunction } from "express";
import MediaModel from "../models/media"
import axios from 'axios';
import env from "../util/validateEnv";

const TMDB_BASE_URL = env.TMDB_BASE_URL
const TMDB_TOKEN = env.TMDB_TOKEN

export const searchTMDB: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { query, page } = req.params;

    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
            params: {
                query: query,
                include_adult: false,
                language: 'en-US',
                page: page
            },
            headers: {
                'Authorization': TMDB_TOKEN,
                'accept': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        next(error)
    }
};



export const saveMedia: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { tmdbId, title, type, release } = req.body;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/${type}/${tmdbId}`, {
            params: {
                language: 'en-US'
            },
            headers: {
                'Authorization': TMDB_TOKEN,
                'accept': 'application/json'
            }
        });
        
        //2nd api call to get imdb Id
        const idResponse = await axios.get(`https://api.themoviedb.org/3/${type}/${tmdbId}/external_ids`, {
            params: {
                language: 'en-US'
            },
            headers: {
                'Authorization': TMDB_TOKEN,
                'accept': 'application/json'
            }
        });

        const idData = idResponse.data
        const imdbId = idData.imdb_id
        const detailedInfo = response.data;
        const genres = detailedInfo.genres;
        const num_seasons = detailedInfo.number_of_seasons

        const newMedia = await MediaModel.create({
            tmdbId: tmdbId,
            title: title,
            type: type,
            imdbID: imdbId,
            numSeasons: num_seasons,
            release: release,
            genres: genres,
            user: (req.user as any)._id
        });

        res.status(201).json(newMedia);
    } catch (error) {
        next(error);
    }
};