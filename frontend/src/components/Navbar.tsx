import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    MediaDiary
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/movies">Movies</Button>
                <Button color="inherit" component={Link} to="/tv">TV</Button>
                <Button color="inherit" component={Link} to="/suggest">Suggest</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
