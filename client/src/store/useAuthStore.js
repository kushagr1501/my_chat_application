import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;  // Global axios setting to always send cookies
import { io } from 'socket.io-client'
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSignup: false,
    islogin: false,
    isUpdatingProfile: false,
    loading: true,
    onlineusers: [],
    socket: null,

    checkAuth: async () => {
        set({ loading: true });   // Start loading
        try {
            const res = await axios.get("http://localhost:4000/api/v1/auth/check", { withCredentials: true });
            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ loading: false });
        }
    },

    signup: async (data) => {
        set({ isSignup: true });
        try {
            const res = await axios.post("http://localhost:4000/api/v1/auth/signup", data, {
                withCredentials: true
            });
            set({ authUser: res.data });
            get().connectSocket()
        } catch (err) {

            console.log(err);
        } finally {
            set({ isSignup: false });
        }
    },
    login: async (data) => {
        set({ islogin: true });
        try {
            const res = await axios.post("http://localhost:4000/api/v1/auth/login", data, {
                withCredentials: true
            });
            set({ authUser: res.data });
            get().connectSocket()
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            set({ islogin: false });
        }
    }, logout: async () => {
        try {
            await axios.post('http://localhost:4000/api/v1/auth/logout', {}, { withCredentials: true });
            get().disconnectSocket()
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            set({ authUser: null });  // Clear user from state
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {

            const res = await axios.put('http://localhost:4000/api/v1/auth/update-profile', data, {
                withCredentials: true,
            })
            set({ authUser: res.data });
            return res.data
        } catch (error) {

            console.log("error in update profile:", error);
        } finally {
            set({ isUpdatingProfile: false });
        }


    },
    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return;

        const socket = io("http://localhost:4000", {
            query: { userId: authUser._id }
        })
        socket.connect()

        set({ socket: socket })
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineusers: userIds })
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect()

    }

}));
