import React, { useState } from 'react';
import { Media } from '../models/media';

//Material UI
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';

const Home: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<Media[]>([]);
    const [notification, setNotification] = useState<{ message: string, open: boolean }>({ message: '', open: false });

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/media/search/${query}/1`);
            const rawData = response.data.results;
            const filteredData = rawData.filter((item: any) => item.media_type === 'tv' || item.media_type === 'movie');
            const transformedData: Media[] = filteredData.map((item: any) => {
                let titleValue = item.title;
                let releaseValue = item.release_date;
                if (item.media_type === 'tv') {
                    titleValue = item.name;
                    releaseValue = item.first_air_date;  
                }
                return {
                    tmdbId: item.id.toString(),
                    title: titleValue,
                    type: item.media_type,
                    release: releaseValue,
                };
            });
            setResults(transformedData);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };
    

    const handleAdd = async (media: Media) => {
        try {
            const response = await axios.post('/api/media', {
                tmdbId: media.tmdbId,
                title: media.title,
                type: media.type
            });
    
            if (response.status === 201) {
                console.log("Media added successfully:", response.data);
                setNotification({ message: "Media added successfully!", open: true });
            } else {
                console.error("Error adding media:", response.data);
                setNotification({ message: "Error adding media.", open: true });
            }
        } catch (error) {
            console.error('Error adding media:', error);
        }
    };    

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12} md={6}>
                    <TextField 
                        fullWidth
                        label="Search" 
                        variant="outlined" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>
    
            <List style={{ width: '100%', maxWidth: 600, marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
                {results.map(media => (
                    <ListItem key={media._id} divider>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item xs={4} style={{ textAlign: 'center' }}>
                                <ListItemText primary={media.title} />
                            </Grid>
                            <Grid item xs={3} style={{ textAlign: 'center' }}>
                                <ListItemText primary={media.release} />
                            </Grid>
                            <Grid item xs={2} style={{ textAlign: 'center' }}>
                                <ListItemText primary={media.type} />
                            </Grid>
                            <Grid item xs={3} style={{ textAlign: 'center' }}>
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="add" onClick={() => handleAdd(media)}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>

    
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
                message={notification.message}
                action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => setNotification({ ...notification, open: false })}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </div>
    );
}

export default Home;
