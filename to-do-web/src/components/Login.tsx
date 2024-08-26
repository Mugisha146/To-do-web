import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import Notification from "./Notification";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const [notification, setNotification] = useState<{
     message: string;
     type: "success" | "error" | "info";
   } | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      navigate("/tasks");
      window.location.reload();
    } catch (error) {
      console.error("Error logging in", error);
      setNotification({ message: "Incorrect Email or Password", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
      <p className="text-lg text-gray-600 mb-6">Please sign in to continue</p>

      <input
        type="email"
        className="border p-3 mb-4 rounded-lg w-full max-w-md border-gray-300"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border  rounded-lg p-3 mb-4 w-full max-w-md border-gray-300"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className={`w-full max-w-md py-3 bg-gray-700 text-white font-bold rounded-lg transition ${
          loading ? "opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
      <p className="mt-6 text-gray-700">
        Don't have an account?{" "}
        <a href="/signup" className="text-gray-900 font-bold">
          Sign up here
        </a>
      </p>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Login;
