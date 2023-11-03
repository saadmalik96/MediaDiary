import express from 'express';
import passport from 'passport';
import env from "../util/validateEnv";

const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect(env.URL);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ message: 'Error during logout' });
        }
        res.clearCookie('connect.sid'); 
        res.json({ message: 'Logged out' });
    });
});


export default router;