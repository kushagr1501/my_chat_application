import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Verify .env file exists
const envPath = path.resolve(process.cwd(), '.env');
console.log('Current working directory:', process.cwd());
console.log('Does .env exist?', fs.existsSync(envPath));

const config = {
    PORT: process.env.PORT || 4000,
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017/',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '4d',
    CLOUDINARY: {
        cloud_name: process.env.cloud_name,
        API_KEY: process.env.API_KEY,
        API_SECRET: process.env.API_SECRET
    },
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    IV: process.env.IV
};

export default config;