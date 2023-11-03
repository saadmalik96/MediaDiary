import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, Select, MenuItem, Typography, Box, Grid } from '@mui/material';

const Suggest: React.FC = () => {
    const [genres, setGenres] = useState<string[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [suggestedMovie, setSuggestedMovie] = useState<string | null>(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get('/api/suggest/genres');
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    const handleSubmit = async () => {
        if (selectedGenre) {
            try {
                const response = await axios.get(`/api/suggest/movie/${selectedGenre}`);
                setSuggestedMovie(response.data.title);
            } catch (error) {
                console.error('Error fetching movie suggestion:', error);
            }
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="genre-label">Genre</InputLabel>
                        <Select
                            labelId="genre-label"
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value as string)}
                        >
                            <MenuItem value=''>Select a genre</MenuItem>
                            {genres.map((genre, index) => (
                                <MenuItem key={index} value={genre}>
                                    {genre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
            {suggestedMovie && (
                <Typography variant="h6" style={{ marginTop: '20px' }}>
                    {suggestedMovie} 
                </Typography>
            )}
        </Box>
    );
}

export default Suggest;
