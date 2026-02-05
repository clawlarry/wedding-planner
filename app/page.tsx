"use client";

import { useState, useEffect } from "react";
import { MapPin, Users, CheckCircle, Calendar, Clock, Heart, Sparkles } from "lucide-react";

export default function Dashboard() {
  const [venues, setVenues] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    .slice(0, 3);

  const stats = [
    { 
      label: "Venues", 
      value: venues.length, 
      icon: MapPin, 
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700"
    },
    { 
      label: "Tasks To Do", 
      value: pendingTasks.length, 
      icon: CheckCircle, 
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    { 
      label: "Guests Confirmed", 
      value: `${confirmedGuests.length}/${guests.length}`, 
      icon: Users, 
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    { 
      label: "Upcoming Viewings", 
      value: upcomingVenues.length, 
      icon: Calendar, 
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-700"
    },
  ];

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-rose-800 text-white p-8 md:p-12 shadow-2xl shadow-rose-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Our Journey Begins</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            We&apos;re Getting Married!
          </h1>
          <p className="text-rose-100 text-lg md:text-xl max-w-2xl mx-auto">
            Let&apos;s plan the perfect day together 
            <span className="inline-block animate-pulse">💕</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <a
            key={stat.label}
            href={stat.label === "Venues" ? "/venues" : stat.label === "Tasks To Do" ? "/tasks" : stat.label === "Guests Confirmed" ? "/guests" : "/venues"}
            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-rose-100/50 hover:-translate-y-1 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          </a>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Viewings */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900">Upcoming Viewings</h3>
            </div>
            <a href="/venues" className="text-sm text-rose-600 hover:text-rose-700 font-medium hover:underline">
              View all →
            </a>
          </div>
          
          {upcomingVenues.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No viewings scheduled yet</p>
              <a href="/venues/new" className="text-rose-600 text-sm font-medium mt-2 inline-block hover:underline">
                Add your first venue
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingVenues.map((venue, i) => (
                <a
                  key={venue.id}
                  href={`/venues/${venue.id}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-50 to-white border border-rose-100/50 hover:shadow-md hover:border-rose-200 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-rose-600 font-bold">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{venue.name}</p>
                    <p className="text-sm text-gray-500">
                      {venue.viewing_date && new Date(venue.viewing_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                      {venue.viewing_time && ` • ${venue.viewing_time}`}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900">Tasks To Complete</h3>
            </div>
            <a href="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
              View all →
            </a>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>All caught up!</p>
              <p className="text-sm mt-1">No pending tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50/50 to-white border border-blue-100/50 hover:border-blue-200 transition-all"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{task.title}</p>
                    {task.due_date && (
                      <p className="text-xs text-gray-500">
                        Due {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: "/venues/new", label: "Add Venue", icon: "📍", color: "bg-rose-50 text-rose-700 hover:bg-rose-100" },
          { href: "/tasks", label: "New Task", icon: "✓", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
          { href: "/guests", label: "Add Guest", icon: "👥", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
          { href: "/budget", label: "Add Expense", icon: "💰", color: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 px-4 py-4 rounded-xl ${action.color} transition-all hover:shadow-md`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="font-medium text-sm">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
