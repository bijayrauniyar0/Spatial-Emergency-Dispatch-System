import dotenv from 'dotenv';
dotenv.config();

export const BASE_URL = process.env.BASE_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const DB_CONNECTION = process.env.DB_CONNECTION;
export const EMAIL_PW = process.env.EMAIL_PW;
export const EMAIL_ID = process.env.EMAIL_ID;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
export const GOOGLE_FOLDER_ID = process.env.GOOGLE_FOLDER_ID;
export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
export const AZURE_STORAGE_ACCOUNT_NAME =
  process.env.AZURE_STORAGE_ACCOUNT_NAME;
export const AZURE_STORAGE_CONTAINER_NAME =
  process.env.AZURE_STORAGE_CONTAINER_NAME || '';
export const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING || '';
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const REDIS_URL = process.env.REDIS_URL;

export const CORS = {
  cors: {
    origin: CORS_ORIGIN,
    credentials: true,
  },
};
