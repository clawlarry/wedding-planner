"use client";

import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Circle, Clock, Trash2 } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "",
    due_date: "",
    priority: "medium",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const categories = ["Venue", "Catering", "Photography", "Flowers", "Music", "Other"];

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Wedding Tasks</h2>
        <p className="text-gray-500 mt-1">Stay organized and on track</p>
      </div>

      {/* Add Task Form */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-rose-500" />
          Add New Task
        </h3>
        <form onSubmit={addTask} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="What needs to be done?"
            required
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none lg:col-span-2"
          />
          <select
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          >
            <option value="">Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input
            type="date"
            value={newTask.due_date}
            onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          />
          <div className="flex gap-2">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <p className="text-3xl font-bold">{pendingTasks.length}</p>
          <p className="text-blue-100">Tasks To Do</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <p className="text-3xl font-bold">{completedTasks.length}</p>
          <p className="text-emerald-100">Completed</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Your Tasks</h3>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No tasks yet</p>
            <p className="text-sm">Add your first task above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-white border border-blue-100/50 hover:border-blue-200 transition-all group"
              >
                <button 
                  onClick={() => toggleTask(task.id)} 
                  className="text-gray-300 hover:text-emerald-500 transition-colors shrink-0"
                >
                  <Circle className="w-6 h-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {task.category && <span>{task.category}</span>}
                    {task.due_date && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Due {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {completedTasks.length > 0 && (
              <>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-500 mb-3">Completed ({completedTasks.length})</p>
                </div>
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 opacity-60 hover:opacity-100 transition-opacity group"
                  >
                    <button 
                      onClick={() => toggleTask(task.id)} 
                      className="text-emerald-500 shrink-0"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-500 line-through truncate">{task.title}</p>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
