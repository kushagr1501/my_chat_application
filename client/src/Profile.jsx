import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore.js';
import { messAuth } from './store/messageStore.js';

function Profile() {
    const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
    const { toggleDM, messageRequests, getMessageRequests, rejectMessageRequest, acceptMessageRequest } = messAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDmEnabled, setIsDmEnabled] = useState(!authUser?.dmOff);
    const [isToggling, setIsToggling] = useState(false);
    console.log(messageRequests);
    useEffect(() => {
        if (authUser?.profilePic) {
            setSelectedImage(authUser.profilePic);
        }

        if (authUser) {
            setIsDmEnabled(!authUser.dmOff);
        }
        getMessageRequests()

    }, [authUser]);


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            setSelectedImage(base64Image);

            try {
                await updateProfile({ profilePic: base64Image });
                alert("Profile picture updated successfully!");
            } catch (error) {
                console.error("Failed to update profile picture", error);
                alert("Failed to update profile picture. Please try again.");
            }
        };

        reader.onerror = () => {
            alert("Error reading file. Please try again.");
        };
    };

    const handleToggleDM = async () => {
        setIsToggling(true);

        try {
            const updatedDmEnabled = !isDmEnabled; // Toggle state before sending request

            await toggleDM(updatedDmEnabled); // Pass new state to backend

            setIsDmEnabled(updatedDmEnabled); // Update UI state

        } catch (error) {
            console.error("Failed to toggle DM", error);
            alert("Failed to toggle DM. Please try again.");
        } finally {
            setIsToggling(false);
        }
    };


    const handleAccept = async (userID) => {
        await acceptMessageRequest(userID)


    }
    const handleReject = async (userID) => {
        await rejectMessageRequest(userID)
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md">
                <div className="flex flex-col items-center py-6 space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800">Profile Page</h1>

                    <div className="relative w-32 h-32">
                        <img
                            src={selectedImage || authUser?.profilePic || '/default-avatar.png'}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-4 border-blue-500"
                        />
                        <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                            📷
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={isUpdatingProfile}
                            />
                        </label>
                    </div>
                    <p className="text-gray-500 text-sm">
                        {isUpdatingProfile ? "Updating profile picture..." : "Click the camera icon to upload"}
                    </p>
                </div>

                <div className="px-6 pb-6 space-y-4">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-gray-600">Full Name</span>
                        <p className="p-2 bg-gray-100 rounded">{authUser?.name || 'N/A'}</p>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-gray-600">Email</span>
                        <p className="p-2 bg-gray-100 rounded">{authUser?.email || 'N/A'}</p>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-gray-600">Member Since</span>
                        <p className="p-2 bg-gray-100 rounded">
                            {authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>

                    {/* Direct Message Status & Toggle */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Direct Messages</span>
                        <p className="text-sm font-medium text-gray-600">
                            {isDmEnabled ? "Enabled" : "Disabled"}
                        </p>
                        <button
                            onClick={handleToggleDM}
                            disabled={isToggling}
                            className={`px-4 py-2 rounded-lg transition ${!isDmEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                                } text-white ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isToggling ? "Processing..." : (!isDmEnabled ? "Enable" : "Disable")}
                        </button>
                    </div>

                    <div className="mt-4 relative">
                        <h2 className="text-lg font-medium">Message Requests</h2>

                        {messageRequests.length > 0 ? (
                            <>
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {messageRequests.length}
                                </span>

                                {messageRequests.map((user) => (
                                    <div key={user._id} className="mt-2 p-3 bg-white rounded-lg shadow-md flex items-center justify-between border border-gray-200">

                                        <p className="text-sm font-medium text-gray-800">{user.name}</p>


                                        <div className="flex gap-2">
                                            <button onClick={() => handleAccept(user._id)} className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition">
                                                Accept
                                            </button>
                                            <button onClick={() => handleReject(user._id)} className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition">
                                                Reject
                                            </button>
                                        </div>
                                    </div>

                                ))}
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">No new requests.</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={logout}
                            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;