import axios from "axios";

const API_URL = "https://to-do-api-dgj1.onrender.com/api";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem("token", response.data.token);
};

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  await axios.post(`${API_URL}/signup`, {
    email,
    password,
    firstName,
    lastName,
  });
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const fetchTasks = async () => {
  const response = await axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response;
};

export const addTask = async (title: string, description: string) => {
  await axios.post(
    `${API_URL}/tasks`,
    { title, description },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const updateTask = async (
  id: string,
  title: string,
  description: string,
  completed: boolean
) => {
  await axios.patch(
    `${API_URL}/tasks/${id}`,
    { title, description, completed },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const deleteTask = async (id: number) => {
  await axios.delete(`${API_URL}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
