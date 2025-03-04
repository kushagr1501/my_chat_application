// import React, { useEffect, useMemo, useState } from 'react';
// import { io } from "socket.io-client";
// import './App.css'
// function Chat() {
//     const [mess, setMess] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [nickname, setNickname] = useState('');
//     const [socketId, setSocketId] = useState('');
//     const [targetId, setTargetId] = useState('');
//     const [onlineUsers, setOnlineUsers] = useState([]);

//     const socket = useMemo(() => io("http://localhost:4000", { withCredentials: true }), []);

//     useEffect(() => {
//         const storedNickname = localStorage.getItem("nickname");
//         const storedUserId = localStorage.getItem("userId");

//         if (storedNickname && storedUserId) {
//             setNickname(storedNickname);
//             socket.emit("set-nickname", { nickname: storedNickname, uid: storedUserId });
//         } else {
//             console.error("Missing nickname or userId in localStorage");
//         }

//         socket.on("connect", () => {
//             setSocketId(socket.id);
//         });

//         socket.on("rec-mess", (data) => {
//             setMessages(prev => [...prev, `${data.nickname}: ${data.text}`]);
//         });

//         socket.on("user-list", (users) => {
//             console.log("Received user list:", users);
//             setOnlineUsers(users);
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, [socket]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (mess.trim()) {
//             socket.emit("message", { nickname, text: mess, targetId: targetId.trim() || null });
//             setMessages(prev => [...prev, `You: ${mess}`]);
//             setMess('');
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
//             <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 border border-gray-700">

//                 {/* Header */}
//                 <div className="text-center">
//                     <p className="text-gray-400 text-sm">Your Socket ID:</p>
//                     <p className="font-bold text-blue-400">{socketId}</p>
//                 </div>

//                 {/* Online Users */}
//                 <div className="bg-gray-700 p-3 rounded-lg space-y-2">
//                     <h3 className="text-lg font-bold text-blue-400">Online Users</h3>
//                     <ul className="space-y-1 text-gray-300">
//                         {onlineUsers.length === 0 ? (
//                             <p className="text-gray-400">No online users</p>
//                         ) : (
//                             onlineUsers.map((user, index) => (
//                                 <li key={index} className="text-sm">
//                                     <span className="font-semibold text-blue-300">{user.nickname}</span> 
//                                     <span className="text-gray-500"> ({user.uid})</span>
//                                 </li>
//                             ))
//                         )}
//                     </ul>
//                 </div>

//                 {/* Messages */}
//                 <div className="h-64 overflow-y-auto bg-gray-700 p-3 rounded-lg space-y-2 border border-gray-600">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`p-2 rounded-lg ${msg.startsWith('You:') ? 'bg-blue-600 self-end text-right' : 'bg-gray-600'}`}>
//                             {msg}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Message Form */}
//                 <form onSubmit={handleSubmit} className="space-y-3">
//                     {/* Target ID Input */}
//                     <input
//                         type="text"
//                         className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-gray-400"
//                         placeholder="Enter target socket ID (optional)"
//                         value={targetId}
//                         onChange={(e) => setTargetId(e.target.value)}
//                     />

//                     {/* Message Input & Button */}
//                     <div className="flex items-center space-x-2">
//                         <input
//                             type="text"
//                             className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-gray-400"
//                             placeholder="Type your message..."
//                             value={mess}
//                             onChange={(e) => setMess(e.target.value)}
//                         />
//                         <button
//                             type="submit"
//                             className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-semibold"
//                         >
//                             Send
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default Chat;


import React, { useState, useEffect } from 'react';
import Test from './Test';
import MessageInput from './MessageInput';

const Chat = ({ authUser, selectedUser }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch messages when `selectedUser` changes (mock or API call)
        setMessages([]); // Example: reset or load real messages here
    }, [selectedUser]);

    const handleSendMessage = (text) => {
        const newMessage = {
            _id: Date.now().toString(), // Temporary unique id
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);

        // Optionally: send message to backend (API call)
    };

    if (!selectedUser) {
        return <div className="flex-1 flex items-center justify-center">Select a user to chat</div>;
    }

    return (
        <div className="flex flex-col h-screen">
            <Test messages={messages} authUser={authUser} selectedUser={selectedUser} />
            <MessageInput onSend={handleSendMessage} />
        </div>
    );
};

export default Chat;

