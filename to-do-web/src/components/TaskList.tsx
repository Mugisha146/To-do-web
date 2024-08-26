import React, { useEffect, useState } from "react";
import { fetchTasks, addTask, updateTask, deleteTask } from "../services/api";

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
    } catch (error) {
      console.error("Error creating task", error);
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
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Task Manager</h1>

        <div className="flex items-center justify-between mb-4">
          <div className="flex-col">
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

            {loading ? (
              <div className="flex justify-center">
                <div className="spinner-border text-warning" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center p-4 bg-white shadow rounded-lg"
                  >
                    <div>
                      <p className="text-xl font-bold text-gray-800">
                        {task.title}
                      </p>
                      <p className="text-gray-600">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
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
                        onClick={() => handleDelete(task.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
