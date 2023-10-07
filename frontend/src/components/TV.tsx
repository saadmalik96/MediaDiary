import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';
import { Media,} from '../models/media';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';

const TV: React.FC = () => {
    const [tv, setTv] = useState<Media[]>([]);
    const [selectedTv, setSelectedTv] = useState<Media | null>(null);
    const [tvDetails, setTvDetails] = useState<any>(null);

    useEffect(() => {
        const fetchTv = async () => {
            try {
                const response = await axios.get('/api/tv');
                setTv(response.data);
            } catch (error) {
                console.error('Error fetching tv shows:', error);
            }
        };

        fetchTv();
    }, []);

    const handleCardClick = async (tv: Media) => {
        setSelectedTv(tv);
        try {
            const response = await axios.get(`/api/tv/details/${tv.tmdbId}`);
            setTvDetails(response.data);
        } catch (error) {
            console.error('Error fetching tv show details:', error);
        }
    };

    const handleClose = () => {
        setSelectedTv(null);
        setTvDetails(null);
    };

    return (
        <Box mt={4} mx={4}> 
            <Grid container spacing={3}>
                {tv.map(tv => (
                    <Grid item xs={12} sm={6} md={3} key={tv._id}>
                        <Card onClick={() => handleCardClick(tv)}>
                            <CardContent>
                                <Typography variant="h5">{tv.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {tv.genres.map(genre => genre.name).join(', ')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
    
            {selectedTv && tvDetails && (
            <Dialog open={Boolean(selectedTv)} onClose={handleClose}>
                <DialogTitle>{tvDetails.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {tvDetails.overview}
                    </DialogContentText>
                    {}
                </DialogContent>
            </Dialog>
        )}
        </Box>
    );   
}

export default TV;
