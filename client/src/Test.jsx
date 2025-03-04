import React, { useState, useRef, useEffect } from "react";
import { messAuth } from "../src/store/messageStore.js";
import Sidebar from "../src/Sidebar.jsx";
import MessageInput from "../src/MessageInput.jsx";
import { useAuthStore } from "../src/store/useAuthStore.js";

const Test = () => {
    const { authUser } = useAuthStore();
    const { messages, sendMessage, selectedUser, ismessloading, blockUser, getusers, getBlockedUsers, pinnedChats, pinChat, unpinChat, getPinnedChats, sendMessageRequest, messageRequests, isUserAccepted, acceptedRequests, listenMessage } = messAuth();

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        getPinnedChats()

    }, [messages]);
    useEffect(() => {
        if (selectedUser) {
            listenMessage();
    
            return () => {
                const socket = useAuthStore.getState().socket;
                socket?.off('message');  // Cleanup on user switch
            };
        }
    }, [selectedUser]); 
    

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


    const handleBlockUser = async (userId) => {

        await blockUser(userId);
        getBlockedUsers(); // Refresh blocked list
        getusers();
        alert("blocked succesfully")
        window.location.reload()
    };
    const isPinned = (userID) => pinnedChats.some(chat => chat._id === userID);
    const handlePinUser = async (userID) => {
        if (!isPinned(userID)) {
            pinChat(userID);
        } else {
            unpinChat(userID);
        }
    };

    const renderProfileImage = (user) => {
        return user?.profilePic ? (
            <img
                src={user.profilePic}
                alt={`${user.username || user.name}'s profile`}
                className="w-8 h-8 rounded-full object-cover"
            />
        ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-semibold text-white">
                {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
        );
    };

    const handleSendReq = async (userId) => {
        await sendMessageRequest(userId);
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar className="overflow-y-auto max-h-screen" />
            <div className="flex-1 flex flex-col bg-white rounded-tl-xl rounded-bl-xl shadow-lg mx-2 my-2 overflow-hidden min-h-full">

                {selectedUser ? (
                    <>
                        {/* Profile Header */}
                        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    {renderProfileImage(selectedUser)}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{selectedUser.username || selectedUser.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handlePinUser(selectedUser?._id)}
                                className="p-2 rounded-full hover:bg-gray-100 text-red-600 transition-colors"
                            >
                                {isPinned(selectedUser?._id) ? "📌" : "📍"}
                            </button>
                            <button
                                onClick={() => handleBlockUser(selectedUser?._id)}
                                className="p-2 rounded-full hover:bg-gray-100 text-red-600 transition-colors"
                            >
                                Block
                            </button>



                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                            {ismessloading ? (
                                <div className="flex justify-center p-4">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center flex-col gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">No messages yet</p>
                                    <p className="text-sm text-gray-400">Send a message to start the conversation</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center my-4">

                                    </div>

                                    {messages.map((msg) => {
                                        const isSender = msg.senderId === authUser?._id;
                                        const profileUser = isSender ? authUser : selectedUser;

                                        return (
                                            <div key={msg._id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                                                {!isSender && (
                                                    <div className="mr-2 mt-1">
                                                        {renderProfileImage(profileUser)}
                                                    </div>
                                                )}

                                                <div
                                                    className={`max-w-xs ${isSender
                                                        ? "bg-blue-600 rounded-lg rounded-tr-none shadow-sm text-white"
                                                        : "bg-white rounded-lg rounded-tl-none shadow-sm text-gray-800"
                                                        }`}
                                                >
                                                    {msg.text && <p className="p-3 text-sm">{msg.text}</p>}
                                                    {msg.image && (
                                                        <img
                                                            src={msg.image}
                                                            alt="Attachment"
                                                            className="max-w-full rounded-lg"
                                                        />
                                                    )}
                                                    <p className={`text-xs px-3 pb-1 text-right ${isSender ? "text-blue-200" : "text-gray-400"}`}>
                                                        {formatDate(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {selectedUser.dmOff && !isUserAccepted(selectedUser._id) ? (
                            <div className="p-3 bg-gray-100 flex justify-center">
                                <button
                                    className="bg-black text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800 transition duration-200"
                                    onClick={() => sendMessageRequest(selectedUser._id)}
                                >
                                    Send Request
                                </button>
                            </div>
                        ) : (
                            <div className="border-t border-gray-200 bg-white">
                                <MessageInput />
                            </div>
                        )}

                    </>
                ) : (
                    <div className="flex items-center justify-center flex-1 flex-col gap-4 bg-gray-50">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 ">Welcome to ChatApp</h3>
                        <p className="text-gray-500">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Convert file to base64
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export default Test;
