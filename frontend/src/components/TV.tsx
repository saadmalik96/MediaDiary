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
                        <DialogContentText>{tvDetails.overview}</DialogContentText>
                        
                        {/* Dropdown for selecting seasons */}
                        <Select
                            value={selectedSeason}
                            onChange={handleSeasonChange}
                            displayEmpty
                        >
                            {Array.from({ length: tvDetails.number_of_seasons }, (_, i) => i + 1).map((season) => (
                                <MenuItem key={season} value={season}>
                                    Season {season}
                                </MenuItem>
                            ))}
                        </Select>

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
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default TV;
