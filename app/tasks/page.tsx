"use client";

import { useState, useEffect } from "react";
import { Plus, CheckCircle, Circle } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "",
    due_date: "",
    priority: "medium",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(stored);
  }, []);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task = {
      id: Date.now().toString(),
      ...newTask,
      status: "pending",
    };
    const updated = [...tasks, task];
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
    setNewTask({ title: "", category: "", due_date: "", priority: "medium" });
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold">Wedding Tasks</h2>

      <form onSubmit={addTask} className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Add New Task</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Task name"
            required
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border rounded-lg px-3 py-2 md:px-4"
          />
          <select
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            className="border rounded-lg px-3 py-2 md:px-4"
          >
            <option value="">Category</option>
            <option value="Venue">Venue</option>
            <option value="Catering">Catering</option>
            <option value="Photography">Photography</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            className="border rounded-lg px-3 py-2 md:px-4"
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            className="border rounded-lg px-3 py-2 md:px-4"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            className="bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 w-full sm:w-auto"
          >
            Add
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4">To Do ({pendingTasks.length})</h3>
        {pendingTasks.length === 0 ? (
          <p className="text-gray-500">All caught up!</p>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border rounded-lg hover:bg-gray-50"
              >
                <button onClick={() => toggleTask(task.id)} className="text-gray-400 hover:text-green-600 flex-shrink-0">
                  <Circle className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">{task.title}</p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {task.category} {task.due_date && `• Due: ${new Date(task.due_date).toLocaleDateString()}`}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
