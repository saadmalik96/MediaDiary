import { InferSchemaType, Schema, model } from "mongoose"

const genreSchema = new Schema({
    id: Number,
    name: String
});

const mediaSchema = new Schema({
    tmdbId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    imdbID: { type: String },
    numSeasons: { type: String },
    release: { type: String },
    genres: [genreSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


type Media = InferSchemaType<typeof mediaSchema>
export default model<Media>("Media", mediaSchema);
