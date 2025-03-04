import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { Login, signup, logout,profile,updateprofile,checkAuth } from "../controllers/auth.controller.js";
const router = Router();
router.post('/login', Login);
router.post('/signup', signup);
router.post('/logout', logout);
router.get('/profile', isLoggedIn, profile);
router.put('/update-profile', isLoggedIn, updateprofile);
router.get("/check", isLoggedIn, checkAuth);
export default router