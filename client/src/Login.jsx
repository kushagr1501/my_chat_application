import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login({ email, password }); 
            window.location.href = '/';     
        } catch (err) {
            // If backend sends error response, show the message
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Login failed. Please try again.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        className="w-full p-3 rounded-lg bg-gray-700 text-white"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                    <input
                        type="password"
                        className="w-full p-3 rounded-lg bg-gray-700 text-white"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold"
                    >
                        Login
                    </button>
                </form>
                <p className="text-white mt-4 text-center">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-blue-400">Sign Up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
