import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

const LoginPage: React.FC = () => {
    const handleGoogleLogin = () => {
        window.location.href = '/auth/google';
        // window.location.href = 'http://localhost:5001/auth/google';
    };

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center'
            }}
        >
            <Typography variant="h2" gutterBottom>
                Media Diary
            </Typography>
            <Box mt={4}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleGoogleLogin}
                >
                    Sign in with Google
                </Button>
            </Box>
        </Container>
    );
}

export default LoginPage;
