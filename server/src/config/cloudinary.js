import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
import config from "../config/index.js";
dotenv.config()
cloudinary.config({
    cloud_name: config.CLOUDINARY.cloud_name ,
    api_key:config.CLOUDINARY.API_KEY ,
    api_secret:config.CLOUDINARY.API_SECRET ,
});

export default cloudinary;