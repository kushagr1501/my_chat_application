import React, { useState, useRef } from 'react';
import { messAuth } from './store/messageStore';

function MessageInput() {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const { sendMessage, selectedUser } = messAuth();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        // Optional: File size limit check 
        if (file.size > 10 * 1024 * 1024) { // 2MB
            alert("File size exceeds 2MB limit.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();  // Prevent form submission refresh

        if (!text.trim() && !imagePreview) return;

        if (!selectedUser) {
            alert("No user selected. Please select a conversation first.");
            return;
        }

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
                receiverId: selectedUser._id,  // Pass the selectedUser's ID
            });

            // Clear input & image
            setText('');
            removeImage();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="bg-gray-50 border-t border-gray-200 p-3">
            {/* Image Preview */}
            {imagePreview && (
                <div className="relative mb-2 inline-block">
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-20 rounded-md border border-gray-300" 
                    />
                    <button 
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        aria-label="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Upload Button */}
                <button 
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => fileInputRef.current.click()}
                    title="Attach image"
                    aria-label="Attach image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>

                {/* Hidden File Input */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    className="hidden" 
                    accept="image/*"
                />

                {/* Text Input */}
                <input 
                    type="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Send Button */}
                <button 
                    type="submit"
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 disabled:opacity-50"
                    disabled={!text.trim() && !imagePreview}
                    title="Send message"
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
