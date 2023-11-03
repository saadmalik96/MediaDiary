export interface Genre {
    id: number;
    name: string;
}

export interface Media {
    _id: string;
    tmdbId: string;
    title: string;
    type: string;
    imdbId: string;
    release: string;
    genres: Genre[];
    numSeasons: number;
    createdAt: string;
    updatedAt: string;
}
