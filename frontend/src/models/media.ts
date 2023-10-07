export interface Genre {
    id: number;
    name: string;
}

export interface Media {
    _id: string;
    tmdbId: string;
    title: string;
    type: string;
    release: string;
    genres: Genre[];
    createdAt: string;
    updatedAt: string;
}
