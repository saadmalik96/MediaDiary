import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';
import { Media,} from '../models/media';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';



const Movies: React.FC = () => {
    const [movies, setMovies] = useState<Media[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Media | null>(null);
    const [movieDetails, setMovieDetails] = useState<any>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('/api/movies');
                setMovies(response.data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, []);

    const handleCardClick = async (movie: Media) => {
        setSelectedMovie(movie);
        try {
            const response = await axios.get(`/api/movies/details/${movie.tmdbId}`);
            setMovieDetails(response.data);
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const handleClose = () => {
        setSelectedMovie(null);
        setMovieDetails(null);
    };

    return (
        <Box mt={4} mx={4}> 
            <Grid container spacing={3}>
                {movies.map(movie => (
                    <Grid item xs={12} sm={6} md={3} key={movie._id}>
                        <Card onClick={() => handleCardClick(movie)}>
                            <CardContent>
                                <Typography variant="h5">{movie.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {movie.genres.map(genre => genre.name).join(', ')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
    
            {selectedMovie && movieDetails && (
            <Dialog open={Boolean(selectedMovie)} onClose={handleClose}>
                <DialogTitle>{movieDetails.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {movieDetails.overview}
                    </DialogContentText>
                    {}
                </DialogContent>
            </Dialog>
        )}
        </Box>
    );   
}

export default Movies;
