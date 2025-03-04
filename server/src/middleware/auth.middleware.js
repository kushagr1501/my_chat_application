import User from "../models/user.model.js";
import config from "../config/index.js";
import JWT from 'jsonwebtoken';

export const isLoggedIn = async (req, res, next) => {
    try {
        let token;

        if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){

            token = req.cookies.token || req.headers.authorization.split(" ")[1]
        }
        console.log(token);

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decodedPayload = JWT.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decodedPayload._id, "name email");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        console.error("Error in isLoggedIn middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
