import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";

function Signup() {
    const [email, setEmail] = useState("");
    const [name, setname] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const{signup}=useAuthStore()

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signup({name,email,password})
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSignup} className="space-y-4">
                    <input
                        type="text"
                        className="w-full p-3 rounded-lg bg-gray-700 text-white"
                        placeholder="name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                    />
                    <input
                        type="email"
                        className="w-full p-3 rounded-lg bg-gray-700 text-white"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full p-3 rounded-lg bg-gray-700 text-white"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="text-white mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-400">Login</a>
                </p>
            </div>
        </div>
    );
}

export default Signup;
