"use client";

import { useState, useEffect } from "react";
import { MapPin, Users, CheckCircle, Calendar, Clock } from "lucide-react";

export default function Dashboard() {
  const [venues, setVenues] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    const storedVenues = JSON.parse(localStorage.getItem("venues") || "[]");
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const storedGuests = JSON.parse(localStorage.getItem("guests") || "[]");
    setVenues(storedVenues);
    setTasks(storedTasks);
    setGuests(storedGuests);
  }, []);

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const confirmedGuests = guests.filter((g) => g.rsvp_status === "confirmed");
  const upcomingVenues = venues
    .filter((v) => v.viewing_date)
    .sort((a, b) => new Date(a.viewing_date).getTime() - new Date(b.viewing_date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center py-4 md:py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Our Wedding Planning</h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Let&apos;s plan the perfect day together 💕</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-rose-500">
          <div className="flex items-center gap-2 md:gap-3">
            <MapPin className="w-6 h-6 md:w-8 md:h-8 text-rose-500" />
            <div>
              <p className="text-xl md:text-2xl font-bold">{venues.length}</p>
              <p className="text-xs md:text-sm text-gray-600">Venues</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center gap-2 md:gap-3">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            <div>
              <p className="text-xl md:text-2xl font-bold">{pendingTasks.length}</p>
              <p className="text-xs md:text-sm text-gray-600">Tasks To Do</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center gap-2 md:gap-3">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <div>
              <p className="text-xl md:text-2xl font-bold">{confirmedGuests.length}/{guests.length}</p>
              <p className="text-xs md:text-sm text-gray-600">Guests Confirmed</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center gap-2 md:gap-3">
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            <div>
              <p className="text-xl md:text-2xl font-bold">{upcomingVenues.length}</p>
              <p className="text-xs md:text-sm text-gray-600">Upcoming Viewings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            Upcoming Venue Viewings
          </h3>
          {upcomingVenues.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming viewings scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingVenues.map((venue) => (
                <div key={venue.id} className="border-l-4 border-rose-400 pl-3 md:pl-4 py-2 bg-rose-50 rounded">
                  <p className="font-semibold text-sm md:text-base">{venue.name}</p>
                  <p className="text-xs md:text-sm text-gray-600">
                    {venue.viewing_date && new Date(venue.viewing_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                    {venue.viewing_time && ` at ${venue.viewing_time}`}
                  </p>
                </div>
              ))}
            </div>
          )}
          <a href="/venues" className="text-rose-600 text-sm mt-3 md:mt-4 inline-block hover:underline">
            View all venues →
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Tasks To Complete
          </h3>
          {pendingTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">All caught up! No pending tasks.</p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-start gap-2 md:gap-3 border-l-4 border-blue-400 pl-3 md:pl-4 py-2 bg-blue-50 rounded">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">{task.title}</p>
                    {task.due_date && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded shrink-0 ${
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
          <a href="/tasks" className="text-blue-600 text-sm mt-3 md:mt-4 inline-block hover:underline">
            View all tasks →
          </a>
        </div>
      </div>
    </div>
  );
}
