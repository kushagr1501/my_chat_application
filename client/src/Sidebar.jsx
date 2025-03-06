import React, { useEffect, useState } from "react";
import { messAuth } from "../src/store/messageStore.js";
import { useAuthStore } from "../src/store/useAuthStore.js";
import { UserCircleIcon, XCircleIcon, PinIcon, Users, Search } from "lucide-react";
import './App.css';

const Sidebar = () => {
    const {
        users,
        getusers,
        setselectedUser,
        selectedUser,
        blockedUsers,
        getBlockedUsers,
        unblockUser,
        pinnedChats,
        getPinnedChats,
        conversations = []
    } = messAuth();

    const { authUser, onlineusers } = useAuthStore();
    const [showBlockedUsers, setShowBlockedUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getusers();
        getBlockedUsers();
        getPinnedChats();
    }, []);

    // Filter users (remove blocked users from main list)
    const filteredUsers = users.filter(
        (user) => !blockedUsers.some((blocked) => blocked._id === user._id)
    );

    // Filter users based on search term
    const searchFilteredUsers = filteredUsers.filter(user => 
        (user.username || user.name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isPinned = (userId) => pinnedChats.some(chat => chat._id === userId);
    const isOnline = (userId) => onlineusers.includes(userId);

    // Sort users based on pinned chats, recent conversations, and other users
    const sortedUsers = () => {
        // Pinned users always come first
        const pinnedUsers = searchFilteredUsers.filter(user => isPinned(user._id));

        // Get users with recent conversations (not pinned)
        const recentConversationUsers = conversations
            .filter(conv => !isPinned(conv.participants[0]._id))
            .map(conv => conv.participants[0])
            .filter(user =>
                searchFilteredUsers.some(filteredUser => filteredUser._id === user._id)
            );

        // Remaining users (neither pinned nor in recent conversations)
        const remainingUsers = searchFilteredUsers.filter(
            user =>
                !isPinned(user._id) &&
                !recentConversationUsers.some(recent => recent._id === user._id)
        );

        // Combine in the desired order: pinned, recent conversations, remaining
        return [
            ...pinnedUsers,
            ...recentConversationUsers,
            ...remainingUsers
        ];
    };

    const handleUnblock = async (userId) => {
        await unblockUser(userId);
        getBlockedUsers();
        alert("Unblocked successfully");
    };

    return (
        <div className="sidebar w-1/4 h-screen bg-slate-50 border-r border-slate-200 flex flex-col sticky top-0 left-0">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between shadow-md">
                <div>
                    <h1 className="text-xl font-bold">Chats</h1>
                    <p className="text-sm text-indigo-100">
                        {onlineusers.length} Online
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowBlockedUsers(!showBlockedUsers)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition flex items-center gap-1"
                        title="Blocked Users"
                    >
                        <Users size={14} />
                        <span className="hidden md:inline">Blocked</span>
                    </button>

                    {authUser?.profilePic ? (
                        <img
                            src={authUser.profilePic}
                            alt="Profile"
                            className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition duration-200 border-2 border-white"
                            onClick={() => window.location.href = '/profile'}
                        />
                    ) : (
                        <UserCircleIcon
                            className="w-8 h-8 cursor-pointer hover:opacity-80 transition duration-200 text-white"
                            onClick={() => window.location.href = '/profile'}
                        />
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="px-3 py-2 border-b border-slate-200">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="w-full py-2 pl-9 pr-4 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                </div>
            </div>

            {/* User Categories */}
            <div className="text-xs font-semibold text-slate-500 px-4 py-2 bg-slate-100">
                
            </div>

            {/* User List */}
            <ul className="divide-y divide-slate-100 overflow-y-auto flex-1 scrollbar">
                {sortedUsers().length > 0 ? (
                    sortedUsers().map((user) => (
                        <li
                            key={user._id}
                            onClick={() => setselectedUser(user)}
                            className={`cursor-pointer px-4 py-3 flex items-center gap-3 transition-all ${
                                selectedUser?._id === user._id 
                                    ? "bg-indigo-50 border-l-4 border-indigo-500" 
                                    : "hover:bg-slate-50 border-l-4 border-transparent"
                            }`}
                        >
                            <div className="relative">
                                {user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold uppercase shadow-sm">
                                        {user.username?.[0]?.toUpperCase() || "U"}
                                    </div>
                                )}
                                {isOnline(user._id) && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-800 truncate">
                                    {user.username || user.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {isOnline(user._id) 
                                        ? "Online now" 
                                        : "Offline"}
                                </p>
                            </div>

                            {isPinned(user._id) && (
                                <PinIcon size={16} className="text-indigo-500" />
                            )}
                        </li>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500 p-4">
                        <Users size={32} className="mb-2 text-slate-400" />
                        <p>{searchTerm ? "No users match your search" : "No available users"}</p>
                    </div>
                )}
            </ul>

            {/* Blocked Users Overlay */}
            {showBlockedUsers && (
                <div className="absolute top-0 left-0 w-full h-full bg-white shadow-lg border border-gray-300 p-4 z-20 overflow-y-auto">

                    <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                        <Users size={18} className="mr-2 text-red-500" />
                        Blocked Users
                    </h2>
                    {blockedUsers.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                            {blockedUsers.map((user) => (
                                <li
                                    key={user._id}
                                    className="px-4 py-3 flex items-center gap-3 transition-all bg-slate-50 rounded-lg my-2 shadow-sm"
                                >
                                    {user.profilePic ? (
                                        <img
                                            src={user.profilePic}
                                            alt={user.username}
                                            className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white font-bold uppercase shadow-sm">
                                            {user.username?.[0]?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-800 truncate">{user.username || user.name}</p>
                                    </div>
                                    <button
                                        onClick={() => handleUnblock(user._id)}
                                        className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
                                        title="Unblock user"
                                    >
                                        <XCircleIcon size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500 p-4">
                            <XCircleIcon size={32} className="mb-2 text-slate-400" />
                            <p>No blocked users</p>
                        </div>
                    )}
                    <button
                        onClick={() => setShowBlockedUsers(false)}
                        className="mt-4 w-full bg-slate-200 text-slate-700 py-2 rounded-md hover:bg-slate-300 transition"
                    >
                        Close
                    </button>
                </div>
            )}

            {/* User account info at bottom */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-3">
                {authUser?.profilePic ? (
                    <img
                        src={authUser.profilePic}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold uppercase">
                        {authUser?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{authUser?.username || authUser?.name || "Your Account"}</p>
                    <p className="text-xs text-slate-500 truncate">Online</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;