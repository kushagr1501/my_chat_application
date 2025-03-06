import React, { useState } from 'react';
import { ReactMediaRecorder } from "react-media-recorder";

function VoiceRecorder({ onUpload }) {
    const [recording, setRec] = useState(false);

    const handleUpload = async (blobUrl) => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        console.log(blob);

        const formData = new FormData();
        formData.append('voiceMessage', blob, 'voiceMessage.webm');

        try {
            const uploadResponse = await fetch('http://localhost:4000/api/v1/upload-voice', {
                method: 'POST',
                body: formData
            });

            if (uploadResponse.ok) {
                const { fileUrl } = await uploadResponse.json();
                if (onUpload) {
                    onUpload(fileUrl);  
                }
            } else {
                console.error('Failed to upload');
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <ReactMediaRecorder
                audio
                blobPropertyBag={{ type: "audio/webm" }}  // Set correct MIME type
                render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
                        <p className="mb-4 font-semibold text-lg">Status: {status}</p>
                        <div className="flex justify-center space-x-4 mb-4">
                            {!recording ? (
                                <button
                                    onClick={() => { setRec(true); startRecording(); }}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                    Start Recording
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setRec(false); stopRecording(); }}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                    Stop Recording
                                </button>
                            )}
                        </div>

                        {mediaBlobUrl && (
                            <div className="mt-4">
                                <audio 
                                    src={mediaBlobUrl} 
                                    controls 
                                    className="w-full rounded-lg border border-gray-700"
                                />
                                <button
                                    onClick={() => handleUpload(mediaBlobUrl)}
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                                    Upload Voice Message
                                </button>
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    );
}

export default VoiceRecorder;
