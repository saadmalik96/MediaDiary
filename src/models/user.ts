import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    googleId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>
export default model<User>("User", userSchema);
