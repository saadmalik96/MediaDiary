import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import mediaRoutes from "./routes/media";
import moviesRoutes from "./routes/movies";
import tvRoutes from "./routes/tv";
import suggestRoutes from "./routes/suggest";
import authRoutes from "./routes/authRoutes";
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import "./auth";
import path from 'path';
import env from "./util/validateEnv";

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect(env.URL);
}

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, './build')));

//Initialize session
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true
}));

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.get('/api/checkAuth', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});


app.use(ensureAuthenticated);

// routes
app.use("/api/media", mediaRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/tv", tvRoutes);
app.use("/api/suggest", suggestRoutes);


app.use((req, res, next) => {
    next(Error("Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) errorMessage = error.message;
    res.status(500).json({ error: errorMessage });
});

export default app;
