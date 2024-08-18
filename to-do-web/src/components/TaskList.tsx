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
    try {
      await addTask(newTaskTitle, newTaskDescription);
      setNewTaskTitle("");
      setNewTaskDescription("");
      loadTasks();
    } catch (error) {
      console.error("Error creating task", error);
    }
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
    <div className="flex flex-col items-center p-4">
      <input
        type="text"
        className="border p-2 mb-4 w-full rounded max-w-md"
        placeholder="Task Title"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <input
        type="text"
        className="border p-2 mb-4 w-full rounded max-w-md"
        placeholder="Task Description"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
      />
      <button
        className="bg-alice text-begic rounded-2xl p-2 w-full max-w-md"
        onClick={handleCreateTask}
      >
        Create Task
      </button>
      <div className="w-full max-w-md mt-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between text-gray-50 items-center mb-2"
          >
            <div>
              <span
                className={`text-lg ${task.completed ? "line-through" : ""}`}
              >
                {task.title}
              </span>
              <p className="text-gray-300">{task.description}</p>
              <p className="text-gray-400 text-sm">
                Created at: {new Date(task.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              className="bg-alice text-begic rounded-md p-1 mx-2"
              onClick={() => toggleComplete(task.id, task.completed)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button
              className="bg-red-500 rounded-md text-white p-1"
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        className="bg-alice rounded-xl text-begic p-2 mt-4"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default TaskList;
