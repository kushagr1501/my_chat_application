import React, { useState, useRef, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { messAuth } from './store/messageStore';

function MessageInput({ isDarkMode }) {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedVoiceEffect, setSelectedVoiceEffect] = useState('Normal');
    const [showEffects, setShowEffects] = useState(false);

    const fileInputRef = useRef(null);
    const inputRef = useRef(null);

    const { sendMessage, selectedUser } = messAuth();

    const { startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } = useReactMediaRecorder({ audio: true });

    useEffect(() => {
        if (mediaBlobUrl) {
            setAudioUrl(mediaBlobUrl);
        }
    }, [mediaBlobUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("File size exceeds 10MB limit.");
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

    const removeAudio = () => {
        setAudioUrl(null);
        clearBlobUrl();
        setSelectedVoiceEffect('Normal');
        setShowEffects(false);
    };

    const handleRecordingToggle = () => {
        if (isRecording) {
            stopRecording();
            setIsRecording(false);
            // Show effects after recording stops
            setShowEffects(true);
        } else {
            startRecording();
            setIsRecording(true);
        }
    };

    const getAudioBase64 = async () => {
        if (!audioUrl) return null;
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleEffectSelect = (effect) => {
        setSelectedVoiceEffect(effect);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!text.trim() && !imagePreview && !audioUrl) return;

        if (!selectedUser) {
            alert("No user selected. Please select a conversation first.");
            return;
        }

        let voiceMessageBase64 = null;
        if (audioUrl) {
            voiceMessageBase64 = await getAudioBase64();
        }

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
                voiceMessage: voiceMessageBase64,
                voiceEffect: selectedVoiceEffect,
                receiverId: selectedUser._id,
            });

            setText('');
            setSelectedVoiceEffect('Normal');
            setShowEffects(false);
            removeImage();
            removeAudio();
            
            // Focus the input after sending
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const voiceEffects = ['Normal', 'Chipmunk', 'Demon', 'Robot', 'Walkie Talkie'];

    return (
        <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t transition-all duration-200`}>
            {/* Image preview */}
            {imagePreview && (
                <div className="relative mb-3 inline-block group">
                    <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-24 rounded-md object-cover"
                        />
                    </div>
                    <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md transition-all"
                        aria-label="Remove image"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Audio preview */}
            {audioUrl && (
                <div className="mb-3">
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                        <div className="flex-1">
                            <audio 
                                controls 
                                src={audioUrl} 
                                className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-100'} rounded`}
                            />
                        </div>
                        <button
                            onClick={removeAudio}
                            className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-sm transition-all"
                            aria-label="Remove audio"
                        >
                            ×
                        </button>
                    </div>

                    {/* Voice Effect Selector */}
                    {showEffects && (
                        <div className="flex flex-wrap gap-2 mt-2 animate-fadeIn">
                            {voiceEffects.map((effect) => (
                                <button
                                    key={effect}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                        selectedVoiceEffect === effect
                                            ? isDarkMode 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-blue-500 text-white'
                                            : isDarkMode
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                    onClick={() => handleEffectSelect(effect)}
                                >
                                    {effect}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Recording indicator */}
            {isRecording && (
                <div className={`flex items-center gap-2 text-red-500 font-medium mb-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} p-2 rounded-lg shadow-sm animate-pulse`}>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Recording in progress...
                </div>
            )}

            {/* Message input form */}
            <form onSubmit={handleSendMessage} className="flex items-center h-5 gap-2">
                <button
                    type="button"
                    className={`p-2 rounded-full ${
                        isDarkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                    } shadow-sm transition-all`}
                    onClick={() => fileInputRef.current.click()}
                    title="Attach image"
                >
                    📂
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                />

                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        className={`w-full py-2 px-4 rounded-full focus:outline-none ${
                            isDarkMode 
                                ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500' 
                                : 'bg-white text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500'
                        } transition-all`}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleRecordingToggle}
                    className={`p-2 rounded-full ${
                        isRecording 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                    } shadow-sm transition-all`}
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                >
                    {isRecording ? '⏹️' : '🎙️'}
                </button>

                <button
                    type="submit"
                    className={`p-2 rounded-full shadow-sm transition-all ${
                        !text.trim() && !imagePreview && !audioUrl
                            ? isDarkMode 
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : isDarkMode 
                                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    disabled={!text.trim() && !imagePreview && !audioUrl}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </form>
        </div>
    );
}

export default MessageInput;