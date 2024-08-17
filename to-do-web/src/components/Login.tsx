import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/tasks");
      window.location.reload(); 
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <input
        type="email"
        className="border p-2 mb-4 w-full max-w-md"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 mb-4 w-full max-w-md"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 w-full max-w-md"
        onClick={handleLogin}
      >
        Login
      </button>
      <button
        className="text-blue-500 mt-4"
        onClick={() => navigate("/signup")}
      >
        Don't have an account? Sign up here
      </button>
    </div>
  );
};

export default Login;
