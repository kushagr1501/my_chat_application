import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';
axios.defaults.withCredentials = true;
import { io } from "socket.io-client"
export const messAuth = create((set, get) => ({
    users: [],
    messages: [],
    selectedUser: null,
    ismessloading: false,
    isuserloading: false,
    pinnedChats: [],
    blockedUsers: [],
    messageRequests: [],
    acceptedRequests: [],
    dmEnabled: true,   //a toggle state for DM feature

    // Fetch sidebar users
    getusers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axios.get("http://localhost:4000/api/v1/messages/users");
            const { blockedUsers } = get();

            const filteredUsers = res.data.filteredUsers.filter(user =>
                !blockedUsers?.includes(user._id)
            );

            set({ users: filteredUsers });
        } catch (error) {
            console.error("Error fetching users:", error.response?.data?.error || error.message);
        } finally {
            set({ isUserLoading: false });
        }
    },


    // Fetch messages between selected user and logged-in user
    getmessages: async (userID) => {
        set({ ismessloading: true });
        try {
            const res = await axios.get(`http://localhost:4000/api/v1/messages/${userID}`);
            set({ messages: res.data.messages });  // backend returns "messages"
        } catch (error) {
            console.error("Error fetching messages:", error.response?.data?.error || error.message);
            set({ messages: [] });
        } finally {
            set({ ismessloading: false });
        }
    },

    // Send message to selected user
    sendMessage: async (messageData) => {
        const { selectedUser, messages, blockedUsers } = get();
        if (!selectedUser) return;

        if (blockedUsers.includes(selectedUser._id)) {
            console.warn("Message not sent. User is blocked.");
            return;
        }

        try {
            const res = await axios.post(`http://localhost:4000/api/v1/messages/send/${selectedUser._id}`, messageData);
            const newMessage = res.data.data;
            set({ messages: [...messages, newMessage] });
        } catch (error) {
            console.error("Error sending message:", error.response?.data?.error || error.message);
        }
    },
    listenMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Clear any old listeners to avoid duplication
        socket.off("message");

        socket.on("message", (message) => {
            const { selectedUser, messages } = messAuth.getState();
            const isMessageForSelectedUser = (
                (message.senderId === selectedUser._id && message.receiverId === useAuthStore.getState().authUser?._id) ||
                (message.receiverId === selectedUser._id && message.senderId === useAuthStore.getState().authUser?._id)
            ); //vvip logic 

            if (isMessageForSelectedUser) {
                messAuth.setState({
                    messages: [...messages, message]
                });

            } else {
                // console.log(`Message from ${message.senderId} ignored (not part of current chat)`);
            }
        });
    },


    listenMessageWhenOffline: () => {
        const socket = useAuthStore.getState().socket
        socket.off("message")
    },


    // Set selected user and auto-load their messages
    setselectedUser: (user) => {
        set({ selectedUser: user });
        if (user) {
            get().getmessages(user._id);
        } else {
            set({ messages: [] });
        }
    },


    getPinnedChats: async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/pinned");
            set({ pinnedChats: res.data.pinnedChats });
        } catch (error) {
            console.error("Error fetching pinned chats:", error.response?.data?.error || error.message);
        }
    },

    // Pin Chat
    pinChat: async (userID) => {
        try {
            await axios.post(`http://localhost:4000/api/v1/pin/${userID}`);
            get().getPinnedChats();  // Refresh pinned list
        } catch (error) {
            console.error("Error pinning chat:", error.response?.data?.error || error.message);
        }
    },

    // Unpin Chat
    unpinChat: async (userID) => {
        try {
            await axios.post(`http://localhost:4000/api/v1/unpin/${userID}`);
            get().getPinnedChats();  // Refresh pinned list
        } catch (error) {
            console.error("Error unpinning chat:", error.response?.data?.error || error.message);
        }
    },

    // Get Blocked Users
    getBlockedUsers: async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/blocks", {
                withCredentials: true,
            });
            console.log(res.data.blockedUsers);
            set({ blockedUsers: res.data.blockedUsers });
        } catch (error) {
            console.error("Error fetching blocked users:", error.response?.data?.error || error.message);
        }
    },

    // Block User
    blockUser: async (userID) => {
        const { blockedUsers, selectedUser } = get();
        if (!userID) return;

        try {
            const res = await axios.post(`http://localhost:4000/api/v1/messages/block/${userID}`);
            if (res.data.success) {
                set({ blockedUsers: [...blockedUsers, userID] });
                if (selectedUser?._id === userID) set({ selectedUser: null }); // Unselect if blocked
            }
        } catch (error) {
            console.error("Error blocking user:", error.response?.data?.error || error.message);
        }
    },


    // Unblock User
    unblockUser: async (userID) => {
        try {
            await axios.post(`http://localhost:4000/api/v1/messages/unblock/${userID}`);
            get().getBlockedUsers();  // Refresh blocked list
        } catch (error) {
            console.error("Error unblocking user:", error.response?.data?.error || error.message);
        }
    },

    // Toggle DM feature
    toggleDM: async () => {
        try {

            const { dmEnabled } = get();
            console.log("Current DM Enabled:", dmEnabled);

            // Toggle the value
            const updatedDmEnabled = !dmEnabled;
            console.log("Updated DM Enabled:", updatedDmEnabled);


            const res = await axios.post("http://localhost:4000/api/v1/toggledm", {
                dmOff: updatedDmEnabled,
            });

            console.log("API Response:", res.data);

            set({ dmEnabled: updatedDmEnabled });

        } catch (error) {
            console.error("Failed to toggle DM:", error.response?.data?.error || error.message);
            alert("Failed to toggle DM. Please try again.");
        }
    },




    // Send Message Request
    sendMessageRequest: async (userID) => {
        try {
            const res = await axios.post("http://localhost:4000/api/v1/request", { receiverId: userID });

            if (res.status === 200) {
                console.log("Message request sent successfully:", res.data.message);
            } else {
                console.warn("Unexpected response:", res.data);
            }
        } catch (error) {
            console.error(
                "Error sending message request:",
                error.response?.data?.message || error.message
            );
        }
    },

    // Get Message Requests
    getMessageRequests: async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/requests");

            if (!res.data || !Array.isArray(res.data.messageRequests)) {
                throw new Error("Invalid response format");
            }

            set({ messageRequests: res.data.messageRequests });
        } catch (error) {
            console.error("Error fetching message requests:", error.response?.data?.message || error.message);
        }
    },


    // Accept Message Request
    acceptMessageRequest: async (requestID) => {
        try {
            await axios.post("http://localhost:4000/api/v1/request/accept", { receiverId: requestID });
            set((state) => ({
                acceptedRequests: [...state.acceptedRequests, requestID],
            }))
            get().getMessageRequests();

        } catch (error) {
            console.error("Error accepting message request:", error.response?.data?.error || error.message);
        }
    },

    // Reject Message Request
    rejectMessageRequest: async (requestID) => {
        try {
            await axios.post("http://localhost:4000/api/v1/request/reject", { receiverId: requestID });
            get().getMessageRequests();  // Refresh list
        } catch (error) {
            console.error("Error rejecting message request:", error.response?.data?.error || error.message);
        }
    },

    getAcceptedRequests: async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/v1/accepted-requests");
            set({ acceptedRequests: res.data.acceptedRequests });
        } catch (error) {
            console.error("Error fetching accepted requests:", error);
        }
    },


    isUserAccepted: (userID) => {
        return get().acceptedRequests.includes(userID);
    },

    // Getter for DM status (added this for clarity)
    getDmStatus: () => {
        return get().dmEnabled;
    }
}));