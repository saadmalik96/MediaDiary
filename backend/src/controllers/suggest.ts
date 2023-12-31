import { Request, RequestHandler, Response, NextFunction } from "express";
import MediaModel from "../models/media";


export const getUniqueGenres: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any)._id;
        const genres = await MediaModel.distinct('genres.name', { user: userId });
        res.status(200).json(genres);
    } catch (error) {
        next(error);
    }
};


export const getRandomMovieByGenre: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any)._id;
        const genreName = req.params.genre;
        const movies = await MediaModel.aggregate([
            { $match: { "genres.name": genreName, user: userId } },
            { $sample: { size: 1 } }
        ]);

        res.status(200).json(movies[0]);
    } catch (error) {
        next(error);
    }
};
