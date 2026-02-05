"use client";

import { useState, useEffect } from "react";
import { Users, CheckCircle, XCircle, HelpCircle, Plus, Heart } from "lucide-react";

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    side: "",
    category: "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem("guests") || "[]");
    setGuests(stored);
  }, []);

  const addGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const guest = {
      id: Date.now().toString(),
      ...newGuest,
      rsvp_status: "pending",
    };
    const updated = [...guests, guest];
    setGuests(updated);
    localStorage.setItem("guests", JSON.stringify(updated));
    setNewGuest({ name: "", email: "", side: "", category: "" });
  };

  const toggleRSVP = (id: string) => {
    const updated = guests.map((g) => {
      if (g.id === id) {
        const next = g.rsvp_status === "confirmed" ? "declined" : g.rsvp_status === "declined" ? "pending" : "confirmed";
        return { ...g, rsvp_status: next };
      }
      return g;
    });
    setGuests(updated);
    localStorage.setItem("guests", JSON.stringify(updated));
  };

  const deleteGuest = (id: string) => {
    const updated = guests.filter((g) => g.id !== id);
    setGuests(updated);
    localStorage.setItem("guests", JSON.stringify(updated));
  };

  const totalGuests = guests.length;
  const confirmed = guests.filter((g) => g.rsvp_status === "confirmed").length;
  const declined = guests.filter((g) => g.rsvp_status === "declined").length;
  const pending = guests.filter((g) => g.rsvp_status === "pending").length;

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Guest List</h2>
        <p className="text-gray-500 mt-1">Keep track of who&apos;s celebrating with you</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
          <p className="text-sm text-gray-500">Total Invited</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">{confirmed}</p>
          <p className="text-sm text-emerald-100">Confirmed ✅</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <XCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">{declined}</p>
          <p className="text-sm text-red-100">Declined ❌</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <HelpCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">{pending}</p>
          <p className="text-sm text-amber-100">Pending ⏳</p>
        </div>
      </div>

      {/* Add Guest Form */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-rose-500" />
          Add Guest
        </h3>
        <form onSubmit={addGuest} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Guest name"
            required
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={newGuest.email}
            onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          />
          <select
            value={newGuest.side}
            onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          >
            <option value="">Side</option>
            <option value="bride">Bride&apos;s Side</option>
            <option value="groom">Groom&apos;s Side</option>
            <option value="both">Both</option>
          </select>
          <select
            value={newGuest.category}
            onChange={(e) => setNewGuest({ ...newGuest, category: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none"
          >
            <option value="">Category</option>
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
          </select>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 transition-all"
          >
            Add Guest
          </button>
        </form>
      </div>

      {/* Guest List */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">All Guests</h3>
        
        {guests.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No guests added yet</p>
            <p className="text-sm">Start building your guest list above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleRSVP(guest.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      guest.rsvp_status === 'confirmed' ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' :
                      guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-600 hover:bg-red-200' :
                      'bg-amber-100 text-amber-600 hover:bg-amber-200'
                    }`}
                  >
                    {guest.rsvp_status === 'confirmed' ? <CheckCircle className="w-5 h-5" /> :
                     guest.rsvp_status === 'declined' ? <XCircle className="w-5 h-5" /> :
                     <HelpCircle className="w-5 h-5" />}
                  </button>
                  <div>
                    <p className="font-semibold text-gray-900">{guest.name}</p>
                    <p className="text-sm text-gray-500">
                      {guest.email && <span className="mr-2">{guest.email}</span>}
                      {guest.side && <span className="capitalize">{guest.side}&apos;s side</span>}
                      {guest.category && <span className="capitalize">• {guest.category}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    guest.rsvp_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {guest.rsvp_status}
                  </span>
                  <button
                    onClick={() => deleteGuest(guest.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-2"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
