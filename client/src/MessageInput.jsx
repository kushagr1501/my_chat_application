import React, { useState, useRef, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { messAuth } from './store/messageStore';

function MessageInput() {
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [selectedVoiceEffect, setSelectedVoiceEffect] = useState('Normal'); // New state for voice effect

    const fileInputRef = useRef(null);

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
        setSelectedVoiceEffect('Normal'); // Reset effect when audio removed
    };

    const handleRecordingToggle = () => {
        if (isRecording) {
            stopRecording();
            setIsRecording(false);
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
                voiceEffect: selectedVoiceEffect, // Send effect to backend
                receiverId: selectedUser._id,
            });

            setText('');
            setSelectedVoiceEffect('Normal'); // Reset after send
            removeImage();
            removeAudio();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const voiceEffects = ['Normal', 'Chipmunk', 'Demon', 'Robot', 'Walkie Talkie'];

    return (
        <div className="bg-gray-50 border-t border-gray-200 p-3">
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
                    >
                        ✖️
                    </button>
                </div>
            )}

            {audioUrl && (
                <div className="mb-2">
                    <div className="flex items-center gap-2">
                        <audio controls src={audioUrl} />
                        <button
                            onClick={removeAudio}
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                            ✖️
                        </button>
                    </div>

                    {/* Voice Effect Selector */}
                    <div className="flex gap-2 mt-2">
                        {voiceEffects.map((effect) => (
                            <button
                                key={effect}
                                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                                    selectedVoiceEffect === effect
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                                onClick={() => handleEffectSelect(effect)}
                            >
                                {effect}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {isRecording && (
                <div className="text-red-500 font-semibold mb-2">🎙️ Recording...</div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => fileInputRef.current.click()}
                    title="Attach image"
                >
                    📎
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                />

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    type="button"
                    onClick={handleRecordingToggle}
                    className={`text-white rounded-full p-2 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-700'}`}
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                >
                    {isRecording ? '⏹️' : '🎙️'}
                </button>

                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 disabled:opacity-50"
                    disabled={!text.trim() && !imagePreview && !audioUrl}
                >
                    ➤
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
