// import Message from "../models/message.model.js";
// import User from "../models/user.model.js";
// import cloudinary from "../config/cloudinary.js";

// export const getSideUsers = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password")
//         res.status(200).json({
//             success: true,
//             message: "users fetched",
//             filteredUsers
//         })
//     } catch (error) {
//         console.error("Error in getUsersForSidebar: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }

// }


// export const getMessages = async (req, res) => {
//     try {
//         const { id: userToChatId } = req.params
//         const userId = req.user._id;
//         const message = await Message.find({
//             $or: [
//                 { senderId: userId, receiverId: userToChatId },
//                 { senderId: userToChatId, receiverId: userId }
//             ]
//         })
//         res.status(200).json({
//             success: true,
//             message: "messages fetched",
//             messages: message
//         })
//     } catch (error) {
//         console.log("Error in getMessages controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }


// export const sendMessage = async (req, res) => {
//     try {
//         const { text, image } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;
//         let imgurl;
//         if (image) {
//             const imgresponse = await cloudinary.uploader.upload(image);
//             imgurl = imgresponse.secure_url;
//         }

//         const message = new Message({
//             senderId,
//             receiverId,
//             text,
//             image: imgurl,
//         })
//         await message.save();
//         res.status(201).json({
//             success: true,
//             message: "messages sent",
//             data: message
//         })

//     } catch (error) {
//         console.log("Error in sendMessage controller: ", error.message);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };


// export const pinChat = async (req, res) => {
//     try {
//         const { id: receiverId } = req.params;
//         const userId = req.user._id;

//         await User.findByIdAndUpdate(userId, {
//             $addToSet: { pinnedChats: receiverId }
//         });

//         res.status(200).json({ message: "Chat pinned successfully" });
//     } catch (error) {
//         console.error("Error in pinChat:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const unpinChat = async (req, res) => {
//     try {
//         const { id: receiverId } = req.params;
//         const userId = req.user._id;

//         await User.findByIdAndUpdate(userId, {
//             $pull: { pinnedChats: receiverId }
//         });

//         res.status(200).json({ message: "Chat unpinned successfully" });
//     } catch (error) {
//         console.error("Error in unpinChat:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const getPinnedChats = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const user = await User.findById(userId).populate('pinnedChats', 'name profilePic');
//         res.status(200).json({ pinnedChats: user.pinnedChats });
//     } catch (error) {
//         console.error("Error in getPinnedChats:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const blockUser = async (req, res) => {
//     try {
//         const { id: receiverId } = req.params;
//         const userId = req.user._id;

//         await User.findByIdAndUpdate(userId, {
//             $addToSet: { blockedUsers: receiverId }
//         });

//         res.status(200).json({ message: "User blocked successfully" });
//     } catch (error) {
//         console.error("Error in blockUser:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const unblockUser = async (req, res) => {
//     try {
//         const { id: receiverId } = req.params;
//         const userId = req.user._id;

//         await User.findByIdAndUpdate(userId, {
//             $pull: { blockedUsers: receiverId }
//         });

//         res.status(200).json({ message: "User unblocked successfully" });
//     } catch (error) {
//         console.error("Error in unblockUser:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const getBlockedUsers = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const user = await User.findById(userId).populate('blockedUsers', 'name profilePic');
//         res.status(200).json({ blockedUsers: user.blockedUsers });
//     } catch (error) {
//         console.error("Error in getBlockedUsers:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

// export const toggleDM = async (req, res) => {
//     try {
//         const { dmOff } = req.body;
//         const userId = req.user._id;

//         await User.findByIdAndUpdate(userId, { dmOff }, { new: true });

//         res.status(200).json({ message: `DM is now ${dmOff ? "OFF" : "ON"}` });
//     } catch (error) {
//         console.error("Error in toggleDM:", error.message);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };



// export const sendMessageRequest = async (req, res) => {
//     const { id:receiverId } = req.body;
//     const senderId = req.user._id;

//     const recipient = await User.findById(receiverId);

//     if (recipient.dmOff) {
//         await User.findByIdAndUpdate(receiverId, {
//             $addToSet: { messageRequests: senderId }
//         });

//         return res.status(200).json({ message: "Message request sent" });
//     }

//     res.status(200).json({ message: "Recipient has DMs enabled. Message directly." });
// };


// export const getMessageRequests = async (req, res) => {
//     const userId = req.user._id;

//     const user = await User.findById(userId).populate('messageRequests', 'name profilePic');

//     res.status(200).json({ messageRequests: user.messageRequests });
// };


// export const acceptMessageRequest = async (req, res) => {
//     const { id:receiverId } = req.body;
//     const userId = req.user._id;

//     await User.findByIdAndUpdate(userId, {
//         $pull: { messageRequests: receiverId }
//     });

//     res.status(200).json({ message: "Message request accepted. You can now chat." });
// };

// export const rejectMessageRequest = async (req, res) => {
//     const { id:receiverId } = req.body;
//     const userId = req.user._id;

//     await User.findByIdAndUpdate(userId, {
//         $pull: { messageRequests: receiverId }
//     });

//     res.status(200).json({ message: "Message request rejected." });
// };


import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../app.js";
export const getSideUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
        res.status(200).json({ success: true, message: "Users fetched", filteredUsers });
    } catch (error) {
        console.error("Error in getSideUsers:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, message: "Messages fetched", messages });
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imgurl = null;
        if (image) {
            const imgResponse = await cloudinary.uploader.upload(image);
            imgurl = imgResponse.secure_url;
        }

        const message = new Message({ senderId, receiverId, text, image: imgurl });
        await message.save();
        const ReceiverSocketId = getReceiverSocketId(receiverId)

        if (ReceiverSocketId) {
            io.to(ReceiverSocketId).emit("message",message)
        }


        res.status(201).json({ success: true, message: "Message sent", data: message });
    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const pinChat = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $addToSet: { pinnedChats: receiverId } });
        res.status(200).json({ message: "Chat pinned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const unpinChat = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $pull: { pinnedChats: receiverId } });
        res.status(200).json({ message: "Chat unpinned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPinnedChats = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('pinnedChats', 'name profilePic');
        res.status(200).json({ pinnedChats: user.pinnedChats });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const blockUser = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $addToSet: { blockedUsers: receiverId } });
        res.status(200).json({ message: "User blocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $pull: { blockedUsers: receiverId } });
        res.status(200).json({ message: "User unblocked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getBlockedUsers = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        const userId = req.user._id;
        const user = await User.findById(userId).populate('blockedUsers', 'name profilePic');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ blockedUsers: user.blockedUsers });
    } catch (error) {
        console.error("Error fetching blocked users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleDM = async (req, res) => {
    try {
        const { dmOff } = req.body;  // Get value from frontend
        const userId = req.user._id;

        console.log("Received dmOff from frontend:", dmOff);  // Debug log

        if (!userId) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch user first
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Toggle the value
        user.dmOff = !dmOff;
        await user.save();

        console.log("Updated dmOff in backend:", user.dmOff);  // Debug log

        res.status(200).json({
            message: `DM is now ${dmOff ? "OFF" : "ON"}`,
            dmOff: user.dmOff,
        });

    } catch (error) {
        console.error("Error toggling DM:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




export const sendMessageRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;

        const recipient = await User.findById(receiverId);
        if (!recipient) {
            return res.status(404).json({ message: "User not found" });
        }

        if (recipient.dmOff) {
            await User.findByIdAndUpdate(receiverId, { $addToSet: { messageRequests: senderId } });
            return res.status(200).json({ message: "Message request sent" });
        }

        res.status(200).json({ message: "Recipient has DMs enabled. Message directly." });

    } catch (error) {
        console.error("Error sending message request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getMessageRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('messageRequests', 'name profilePic');
        res.status(200).json({ messageRequests: user.messageRequests });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const acceptMessageRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $pull: { messageRequests: receiverId } });
        res.status(200).json({ message: "Message request accepted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectMessageRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $pull: { messageRequests: receiverId } });
        res.status(200).json({ message: "Message request rejected" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
