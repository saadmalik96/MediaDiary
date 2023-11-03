import app from "./app"
import mongoose from "mongoose";
import env from "./util/validateEnv";

const PORT = process.env.PORT || 5001;

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(() => {
    console.log("Mongoose Connected")
    app.listen(PORT, () => {
        console.log("Server running on port " + PORT);
    });
})
.catch(console.error);


