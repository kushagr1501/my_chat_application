import { Router } from "express";
import authRoutes from "./auth.routes.js";  
import messRoutes from  "./message.routes.js"
import { getBlockedUsers,pinChat,unpinChat,getPinnedChats,toggleDM,getMessageRequests,sendMessageRequest,acceptMessageRequest,rejectMessageRequest,getAcceptedRequests } from "../controllers/message.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
const router = Router();
router.use('/auth', authRoutes)
router.use('/messages', messRoutes);
router.get('/blocks', isLoggedIn, getBlockedUsers);
router.post('/pin/:id', isLoggedIn, pinChat);
router.post('/unpin/:id', isLoggedIn, unpinChat);
router.get('/pinned', isLoggedIn, getPinnedChats);
router.get('/requests', isLoggedIn, getMessageRequests);
router.post('/request', isLoggedIn, sendMessageRequest);

router.post('/request/accept', isLoggedIn, acceptMessageRequest);
router.get('/accepted-requests', isLoggedIn, getAcceptedRequests);
router.post('/request/reject', isLoggedIn, rejectMessageRequest);

router.post('/toggledm', isLoggedIn, toggleDM);
export default router;