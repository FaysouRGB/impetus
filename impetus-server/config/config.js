import { config } from "dotenv";
config();

export const PORT = process.env.PORT;
export const FRONTEND_URL = process.env.FRONTEND_URL;

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
export const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const MONGO_URI = process.env.MONGO_URI;
