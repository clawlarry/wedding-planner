import db from "@/lib/db";
import { format, parseISO } from "date-fns";
import { Plus, CheckCircle, Circle, Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function toggleTask(formData: FormData) {
  "use server";
  const id = formData.get("id");
  const status = formData.get("status");
  const newStatus = status === "completed" ? "pending" : "completed";
  
  db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(newStatus, id);
  redirect("/tasks");
}

async function addTask(formData: FormData) {
  "use server";
  const title = formData.get("title");
  const category = formData.get("category");
  const due_date = formData.get("due_date");
  const priority = formData.get("priority");
  
  db.prepare(
    "INSERT INTO tasks (title, category, due_date, priority) VALUES (?, ?, ?, ?)"
  ).run(title, category, due_date, priority);
  redirect("/tasks");
}

const categories = ["Venue", "Catering", "Photography", "Music", "Flowers", "Attire", "Invitations", "Other"];

export default function TasksPage() {
  const tasks = db.prepare("SELECT * FROM tasks ORDER BY status, due_date").all();
  const pendingTasks = tasks.filter((t: any) => t.status !== "completed");
  const completedTasks = tasks.filter((t: any) => t.status === "completed");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Wedding Tasks</h2>
        <p className="text-gray-600">{pendingTasks.length} pending, {completedTasks.length} completed</p>
      </div>

      {/* Add Task Form */}
      <form action={addTask} className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Task
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Task name"
            required
            className="border rounded-lg px-4 py-2"
          />
          <select name="category" className="border rounded-lg px-4 py-2">
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            name="due_date"
            className="border rounded-lg px-4 py-2"
          />
          <select name="priority" className="border rounded-lg px-4 py-2">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700"
        >
          Add Task
        </button>
      </form>

      {/* Pending Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">To Do ({pendingTasks.length})</h3>
        {pendingTasks.length === 0 ? (
          <p className="text-gray-500">All caught up! No pending tasks.</p>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task: any) => (
              <form
                key={task.id}
                action={toggleTask}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg border"
              >
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value={task.status} />
                <button type="submit" className="text-gray-400 hover:text-green-600">
                  <Circle className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  <div className="flex gap-3 text-sm text-gray-500">
                    {task.category && <span>📁 {task.category}</span>}
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(parseISO(task.due_date), "MMM d")}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </form>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-500">Completed ({completedTasks.length})</h3>
          <div className="space-y-2">
            {completedTasks.map((task: any) => (
              <form
                key={task.id}
                action={toggleTask}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border opacity-60"
              >
                <input type="hidden" name="id" value={task.id} />
                <input type="hidden" name="status" value={task.status} />
                <button type="submit" className="text-green-600 hover:text-gray-400">
                  <CheckCircle className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <p className="font-medium line-through">{task.title}</p>
                  {task.category && <span className="text-sm text-gray-500">📁 {task.category}</span>}
                </div>
              </form>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
