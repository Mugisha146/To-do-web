import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import Notification from "./Notification";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signup(email, password, firstName, lastName);
      setNotification({
        message: "User created successfully",
        type: "success",
      });
      navigate("/login"); 
    } catch (error) {
      console.error("Error signing up", error);
      setNotification({ message: "Please Fill all field", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Create Your Account
      </h1>
      <p className="text-lg text-gray-600 mb-6">Join us to get started</p>

      <input
        type="text"
        className="w-full max-w-md p-3 mb-4 border rounded-lg border-gray-300"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        className="w-full max-w-md p-3 mb-4 border rounded-lg border-gray-300"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="email"
        className="w-full max-w-md p-3 mb-4 border rounded-lg border-gray-300"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full max-w-md p-3 mb-4 border rounded-lg border-gray-300"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className={`w-full max-w-md py-3 bg-gray-700 text-white font-bold rounded-lg transition ${
          loading ? "opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign Up"}
      </button>

      <p className="mt-6 text-gray-700">
        Already have an account?{" "}
        <a href="/login" className="text-gray-900 font-bold">
          Log in here
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

export default Signup;
