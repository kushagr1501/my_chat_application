import React, { useEffect, useState } from "react";
import { messAuth } from "../src/store/messageStore.js";
import { useAuthStore } from "../src/store/useAuthStore.js";
import { UserCircleIcon, XCircleIcon } from "lucide-react";
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

    useEffect(() => {
        getusers();
        getBlockedUsers();
        getPinnedChats();
    }, []);

    // Filter users (remove blocked users from main list)
    const filteredUsers = users.filter(
        (user) => !blockedUsers.some((blocked) => blocked._id === user._id)
    );

    const isPinned = (userId) => pinnedChats.some(chat => chat._id === userId);
    const isOnline = (userId) => onlineusers.includes(userId);

    // Sort users based on pinned chats, recent conversations, and other users
    const sortedUsers = () => {
        // Pinned users always come first
        const pinnedUsers = filteredUsers.filter(user => isPinned(user._id));

        // Get users with recent conversations (not pinned)
        const recentConversationUsers = conversations
            .filter(conv => !isPinned(conv.participants[0]._id))
            .map(conv => conv.participants[0])
            .filter(user =>
                filteredUsers.some(filteredUser => filteredUser._id === user._id)
            );

        // Remaining users (neither pinned nor in recent conversations)
        const remainingUsers = filteredUsers.filter(
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
        <div className="w-1/4 h-screen bg-slate-50 border-r border-slate-200 flex flex-col">
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
                        className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition"
                    >
                        Blocked Users
                    </button>

                    {authUser?.profilePic ? (
                        <img
                            src={authUser.profilePic}
                            alt="Profile"
                            className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition duration-200"
                            onClick={() => window.location.href = '/profile'}
                        />
                    ) : (
                        <UserCircleIcon
                            className="w-8 h-8 cursor-pointer hover:opacity-80 transition duration-200"
                            onClick={() => window.location.href = '/profile'}
                        />
                    )}
                </div>
            </div>

            {/* User List */}
            <ul className="divide-y divide-slate-100 overflow-y-auto flex-1">
                {sortedUsers().length > 0 ? (
                    sortedUsers().map((user) => (
                        <li
                            key={user._id}
                            onClick={() => setselectedUser(user)}
                            className={`cursor-pointer px-4 py-3 flex items-center gap-3 transition-all ${selectedUser?._id === user._id ? "bg-indigo-50" : "hover:bg-slate-50"
                                }`}
                        >
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
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-800 truncate">{user.username || user.name}</p>
                            </div>

                            <div className="text-xl">
                                {isPinned(user._id) ? "📌" : "📍"}
                            </div>
                            {isOnline(user._id) ? (
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            ) : (
                                <p className="text-gray-500 text-sm">Offline</p>)}
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500 p-4">No available users</p>
                )}
            </ul>

            {/* Blocked Users */}
            {showBlockedUsers && (
                <div className="absolute top-0 left-1/4 w-1/4 h-screen bg-white shadow-lg border border-gray-300 p-4 z-10">
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Blocked Users</h2>
                    {blockedUsers.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                            {blockedUsers.map((user) => (
                                <li
                                    key={user._id}
                                    className="px-4 py-3 flex items-center gap-3 transition-all bg-gray-100"
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
                                        className="text-green-500 hover:text-green-700"
                                    >
                                        <XCircleIcon size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 p-4">No blocked users</p>
                    )}
                    <button
                        onClick={() => setShowBlockedUsers(false)}
                        className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default Sidebar;