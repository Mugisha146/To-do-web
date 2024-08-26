import React, { useEffect, useState } from "react";
import { fetchTasks, addTask, updateTask, deleteTask } from "../services/api";
import Modal from "./Modal";
import Notification from "./Notification";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const [notification, setNotification] = useState<{
     message: string;
     type: "success" | "error" | "info";
   } | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleCreateTask = async () => {
    setLoading(true);
    try {
      await addTask(newTaskTitle, newTaskDescription);
      setNewTaskTitle("");
      setNewTaskDescription("");
      loadTasks();
       setNotification({
         message: "Task created successfully",
         type: "success",
       });
    } catch (error) {
      console.error("Error creating task", error);
       setNotification({ message: "Error creating task", type: "error" });
    }
    setLoading(false);
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    try {
      await updateTask(
        id.toString(),
        newTaskTitle,
        newTaskDescription,
        !completed
      );
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        )
      );
      setNotification({
        message: "Task updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error updating task", error);
      setNotification({ message: "Error updating task", type: "error" });
    }
  };

  const confirmDelete = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.id);
        setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
        setShowDeleteModal(false);
        setTaskToDelete(null);
        setNotification({ message: "Task deleted successfully", type: "success" });
      } catch (error) {
        console.error("Error deleting task", error);
        setNotification({ message: "Error deleting task", type: "error" });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setNotification({ message: "You have been logged out", type: "info" });
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Task Manager</h1>

        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 mb-2 border rounded-lg border-gray-300"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-3  mb-2 border rounded-lg border-gray-300"
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          <button
            onClick={handleCreateTask}
            className={`w-full py-3 bg-gray-700 text-white font-bold rounded-lg transition mb-6 ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Add Task"}
          </button>
        </div>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-col justify-between items-center p-4 bg-white shadow rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p
                    className={`text-xl font-bold ${
                      task.completed
                        ? "line-through text-gray-500"
                        : " text-gray-800"
                    }`}
                  >
                    {task.title}
                  </p>
                </div>
                <div className="flex  items-center space-x-2">
                  <p className="  text-gray-600">{task.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-gray-500 pt-2 text-sm">
                  Created at: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => toggleComplete(task.id, task.completed)}
                  className={`px-4 py-2 rounded-lg ${
                    task.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {task.completed ? "Completed" : "Complete"}
                </button>
                <button
                  onClick={() => confirmDelete(task)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-3 mt-6 bg-gray-700 text-white font-bold rounded-lg"
        >
          Logout
        </button>
      </div>
      {showDeleteModal && taskToDelete && (
        <Modal
          title="Confirm Delete"
          message={`Are you sure you want to delete the task "${taskToDelete.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showLogoutModal && (
        <Modal
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

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

export default TaskList;
