import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TaskList from "./components/TaskList";
import { login, signup, logout } from "./services/api";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    !!localStorage.getItem("token")
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      await signup(email, password, firstName, lastName);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/tasks"
          element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
