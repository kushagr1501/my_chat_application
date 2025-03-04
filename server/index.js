import mongoose from "mongoose";
import { server, app } from './src/app.js';    // Import `server` and `app`
import config from '../server/src/config/index.js';

const port = 4000;

(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);
        console.log("Connected to MongoDB");

        // Start server AFTER DB connection is established
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });

        server.on('error', (err) => {
            console.error("Server error:", err);
            process.exit(1);  
        });

    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1);  
    }
})();
