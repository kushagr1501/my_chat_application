import dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

const config = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/',
    JWT_SECRET: process.env.JWT_SECRET || 'yourkushuuuuu',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '4d',
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    IV: process.env.IV,
};

export default config;
