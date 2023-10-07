import "dotenv/config"
import express, { NextFunction, Request, Response } from "express";
import mediaRoutes from "./routes/media"
import moviesRoutes from "./routes/movies"
import tvRoutes from "./routes/tv"
import suggestRoutes from "./routes/suggest"; 

const app = express();

app.use(express.json());

app.use("/api/media", mediaRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/tv", tvRoutes);
app.use("/api/suggest", suggestRoutes);

 
app.use((req, res, next) => {
    next(Error("Endpoint not found"))
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) errorMessage = error.message;
    res.status(500).json({error: errorMessage})
})

export default app;