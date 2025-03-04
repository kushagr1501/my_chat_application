import { Router } from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import {
    getSideUsers,
    getMessages,
    sendMessage,
    pinChat,
    unpinChat,
    getPinnedChats,
    blockUser,
    unblockUser,
    getBlockedUsers,
    toggleDM,
    sendMessageRequest,
    getMessageRequests,
    acceptMessageRequest,
    rejectMessageRequest
} from "../controllers/message.controller.js";

const router = Router();

router.get('/users', isLoggedIn, getSideUsers);

// Messages
router.get('/:id', isLoggedIn, getMessages);
router.post('/send/:id', isLoggedIn, sendMessage);

// Pinned Chats
router.post('/pin/:id', isLoggedIn, pinChat);
router.post('/unpin/:id', isLoggedIn, unpinChat);
router.get('/pinned', isLoggedIn, getPinnedChats);

// Block/Unblock Users
router.post('/block/:id', isLoggedIn, blockUser);
router.post('/unblock/:id', isLoggedIn, unblockUser);
router.get('/blocks', isLoggedIn, getBlockedUsers);

// DM Toggle
router.post('/toggle-dm', isLoggedIn, toggleDM);

// Message Requests
// router.post('/request', isLoggedIn, sendMessageRequest);

// router.post('/request/accept', isLoggedIn, acceptMessageRequest);
// router.post('/request/reject', isLoggedIn, rejectMessageRequest);

export default router;


