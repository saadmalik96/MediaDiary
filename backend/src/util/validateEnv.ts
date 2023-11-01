import { cleanEnv } from "envalid";
import {port, str} from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    TMDB_BASE_URL: str(),
    TMDB_TOKEN: str(),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_SECRET_ID: str(),
    SESSION_SECRET: str(),
})