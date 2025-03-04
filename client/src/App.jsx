import React, { useEffect } from "react";
// import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Chat from "./Chat.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import Test from "./Test.jsx";
import Profile from "./Profile.jsx";

function App() {
    const { authUser, checkAuth, loading } = useAuthStore()

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    console.log("cc", authUser);
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-white">Loading...</p>
            </div>
        );
    }


    return (

        <Routes>
            <Route path="/" element={authUser ? <Test /> : <Navigate to="/login" />} />
            <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/login" />} />
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
            <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
