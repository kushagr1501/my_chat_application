import React, { useState, useRef, useEffect } from "react";
import { messAuth } from "../src/store/messageStore.js";
import Sidebar from "../src/Sidebar.jsx";
import MessageInput from "../src/MessageInput.jsx";
import { useAuthStore } from "../src/store/useAuthStore.js";
import Linkify from 'linkify-react';
import ReactAudioPlayer from 'react-audio-player';

const MessageText = ({ text, isDarkMode }) => {
    const linkifyOptions = {
        target: '_blank',
        className: isDarkMode ? 'text-blue-300 underline' : 'text-blue-600 underline'
    };

    return <Linkify options={linkifyOptions}>{text}</Linkify>;
};

const Test = () => {
    const { authUser,socket } = useAuthStore();
    const { messages, selectedUser, ismessloading, blockUser, getusers, getBlockedUsers, pinnedChats, pinChat, unpinChat, getPinnedChats, sendMessageRequest, listenMessage, acceptedRequests, getAcceptedRequests,listenForRequestAccepted } = messAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        getPinnedChats();
    }, [messages]);

    useEffect(() => {
        if (selectedUser) {
            listenMessage();
            getAcceptedRequests();

            return () => {
                const socket = useAuthStore.getState().socket;
                socket?.off('message');
            };
        }
    }, [selectedUser]);
    useEffect(()=>{
        listenForRequestAccepted()

    },[])

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleBlockUser = async (userId) => {
        await blockUser(userId);
        getBlockedUsers();
        getusers();
        alert("Blocked successfully");
        window.location.reload();
    };

    const isPinned = (userID) => pinnedChats.some(chat => chat._id === userID);

    const handlePinUser = async (userID) => {
        if (!isPinned(userID)) {
            pinChat(userID);
        } else {
            unpinChat(userID);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const renderProfileImage = (user) => {
        return user?.profilePic ? (
            <img
                src={user.profilePic}
                alt={`${user.username || user.name}'s profile`}
                className="w-8 h-8 rounded-full object-cover"
            />
        ) : (
            <div className={`w-8 h-8 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-full flex items-center justify-center font-semibold text-white`}>
                {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
        );
    };

    const handleSendMessageReq = async (userId) => {
        await sendMessageRequest(userId)
        alert("req send sucessfully ")

    }

    console.log("accepted users are ", acceptedRequests);

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <Sidebar className={`overflow-y-auto max-h-screen ${isDarkMode ? 'bg-gray-800' : ''}`} />
            <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-tl-xl rounded-bl-xl shadow-lg mx-2 my-2 overflow-hidden min-h-full relative`}>
                {selectedUser ? (
                    <>
                        {/* Sticky header - fixed at the top of its parent container */}
                        <div className={`px-4 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b flex items-center justify-between sticky top-0 z-50 shadow-sm`}>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    {renderProfileImage(selectedUser)}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{selectedUser.username || selectedUser.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleDarkMode}
                                    className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-yellow-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                                >
                                    {isDarkMode ? '☀️' : '🌙'}
                                </button>
                                <button
                                    onClick={() => handlePinUser(selectedUser?._id)}
                                    className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} text-red-600 transition-colors`}
                                >
                                    {isPinned(selectedUser?._id) ? "📌" : "📍"}
                                </button>
                                <button
                                    onClick={() => handleBlockUser(selectedUser?._id)}
                                    className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'} transition-colors`}
                                >
                                    Block
                                </button>
                            </div>
                        </div>

                        {/* Messages container with flex-1 to take available space */}
                        <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ height: "calc(100% - 120px)" }}>
                            {ismessloading ? (
                                <div className="flex justify-center p-4">
                                    <div className={`w-8 h-8 border-4 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'} border-t-transparent rounded-full animate-spin`}></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center flex-col gap-4">
                                    <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-blue-800' : 'bg-blue-100'} flex items-center justify-center`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>No messages yet</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Send a message to start the conversation</p>
                                </div>
                            ) : (
                                <>
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
                                                        ? `${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'} rounded-lg rounded-tr-none shadow-sm text-white`
                                                        : `${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg rounded-tl-none shadow-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`
                                                        }`}
                                                >
                                                    {msg.text && (
                                                        <p className="p-3 text-sm"><MessageText text={msg.text} isDarkMode={isDarkMode} /></p>
                                                    )}
                                                    {msg.image && (
                                                        <img
                                                            src={msg.image}
                                                            alt="Attachment"
                                                            className="max-w-full rounded-lg"
                                                        />
                                                    )}
                                                    {msg.voiceMessage && (
                                                        <ReactAudioPlayer
                                                            src={msg.voiceMessage}
                                                            controls
                                                            className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'} rounded p-1`}
                                                        />
                                                    )}
                                                    <p className={`text-xs px-3 pb-1 text-right ${isSender
                                                        ? `${isDarkMode ? 'text-blue-200' : 'text-blue-200'}`
                                                        : `${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`
                                                        }`}>
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


                        <div className={`${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} border-t w-full absolute bottom-0 left-0 right-0`}>
                            {selectedUser.isBlocked ? (
                                <div className={`p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex justify-center`}>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>You can't text at this time.</p>
                                </div>
                            ) : selectedUser.dmOff ? (
                                <div className={`p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex justify-center`}>
                                    {acceptedRequests.some(req =>
                                        req._id === selectedUser._id ||
                                        (typeof req === 'object' && (req.userId === selectedUser._id || req.receiverId === selectedUser._id))
                                    ) ? (
                                        <MessageInput className="sticky" isDarkMode={isDarkMode} />
                                    ) : (
                                        <button
                                            className={`${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-black text-white hover:bg-gray-800'} px-4 py-2 rounded-md shadow-md transition duration-200`}
                                            onClick={() => handleSendMessageReq(selectedUser._id)}
                                        >
                                            Send Request
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <MessageInput className="sticky" isDarkMode={isDarkMode} />
                            )}
                        </div>


                    </>
                ) : (
                    <div className={`flex items-center justify-center flex-1 flex-col gap-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Welcome to ChatApp</h3>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Select a conversation to start messaging</p>
                        <button
                            onClick={toggleDarkMode}
                            className={`mt-4 p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'} transition-colors`}
                        >
                            {isDarkMode ? '🌝 Light Mode' : '🌚 Dark Mode'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test;