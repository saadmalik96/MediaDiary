import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Dialog, DialogTitle, DialogContent, DialogContentText, Select, MenuItem, SelectChangeEvent} from '@mui/material';
import axios from 'axios';
import { Media, Genre } from '../models/media';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const TV: React.FC = () => {
    const [tvShows, setTvShows] = useState<Media[]>([]);
    const [selectedTv, setSelectedTv] = useState<Media | null>(null);
    const [tvDetails, setTvDetails] = useState<any>(null);
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchTvShows = async () => {
            try {
                const response = await axios.get('/api/tv');
                setTvShows(response.data);
            } catch (error) {
                console.error('Error fetching TV shows:', error);
            }
        };

        fetchTvShows();
    }, []);

    const handleCardClick = async (tv: Media) => {
        setSelectedTv(tv);
        try {
            const detailsResponse = await axios.get(`/api/tv/details/${tv.tmdbId}`);
            setTvDetails(detailsResponse.data);
            fetchSeasonRatings(tv.tmdbId, 1);
        } catch (error) {
            console.error('Error fetching TV show details:', error);
        }
    };

    const fetchSeasonRatings = async (tmdbId: string, seasonNumber: number) => {
        try {
            const response = await axios.get(`/api/tv/ratings/${tmdbId}/season/${seasonNumber}`);
            // Format the data for the chart
            const formattedData = response.data.map((episode: any) => ({
                name: `Episode ${episode.episodeNumber}`,
                imdbID: episode.imdbID,
                Rating: parseFloat(episode.imdbRating) || null 
            }));
            setChartData(formattedData);
        } catch (error) {
            console.error('Error fetching season ratings:', error);
        }
    };

    const handleSeasonChange = (event: SelectChangeEvent<number>) => {
        const seasonNumber = event.target.value as number;
        setSelectedSeason(seasonNumber);
        if (selectedTv) {
            fetchSeasonRatings(selectedTv.tmdbId, seasonNumber);
        }
    };

    const handleClose = () => {
        setSelectedTv(null);
        setTvDetails(null);
    };

    return (
        <Box mt={4} mx={4}>
            <Grid container spacing={3}>
                {tvShows.map((tv) => (
                    <Grid item xs={12} sm={6} md={3} key={tv._id}>
                        <Card onClick={() => handleCardClick(tv)}>
                            <CardContent>
                                <Typography variant="h5">{tv.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {tv.genres.map((genre: Genre) => genre.name).join(', ')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {selectedTv && tvDetails && (
                <Dialog open={Boolean(selectedTv)} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle>{tvDetails.name}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        {/* Image rendering */}
                                        <img
                                            src={`https://image.tmdb.org/t/p/original${tvDetails.poster_path}`}
                                            alt={tvDetails.name}
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        {/* Overview, number of episodes and seasons */}
                                        <DialogContentText>
                                        <strong>Overview:</strong><br></br> {tvDetails.overview}
                                        </DialogContentText>
                                        <br></br>
                                        <Typography variant="body1" gutterBottom>
                                            <strong>Number of Episodes:</strong> {tvDetails.number_of_episodes}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            <strong>Number of Seasons:</strong> {tvDetails.number_of_seasons}
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container spacing={2} alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    {/* Title for the ratings chart */}
                                    <Typography variant="h6" gutterBottom>
                                        Ratings Chart
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    {/* Dropdown for selecting seasons */}
                                    <Select
                                        value={selectedSeason}
                                        onChange={handleSeasonChange}
                                        displayEmpty
                                        style={{ minWidth: 120 }}
                                    >
                                        {Array.from({ length: tvDetails.number_of_seasons }, (_, i) => i + 1).map((season) => (
                                            <MenuItem key={season} value={season}>
                                                Season {season}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {/* Chart to display episode ratings */}
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart
                                        data={chartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[1, 10]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Rating" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default TV;
