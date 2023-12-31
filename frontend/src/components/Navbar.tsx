import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                navigate('/login');
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

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
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
