import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
dotenv.config()
cloudinary.config({
    cloud_name: process.env.cloud_name || "dskq6j62q",
    api_key: process.env.API_KEY || "369222532892281",
    api_secret: "s43PC67Et_DZzLGPnkko2aOPeJ8",
});

export default cloudinary;