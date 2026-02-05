"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    side: "",
    category: "",
  });

  useEffect(() => {
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

  const totalGuests = guests.length;
  const confirmed = guests.filter((g) => g.rsvp_status === "confirmed").length;
  const declined = guests.filter((g) => g.rsvp_status === "declined").length;
  const pending = guests.filter((g) => g.rsvp_status === "pending").length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Guest List</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-xl md:text-3xl font-bold">{totalGuests}</p>
          <p className="text-xs md:text-sm text-gray-600">Total Invited</p>
        </div>
        <div className="bg-green-50 p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-xl md:text-3xl font-bold text-green-700">{confirmed}</p>
          <p className="text-xs md:text-sm text-green-600">Confirmed ✅</p>
        </div>
        <div className="bg-red-50 p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-xl md:text-3xl font-bold text-red-700">{declined}</p>
          <p className="text-xs md:text-sm text-red-600">Declined ❌</p>
        </div>
        <div className="bg-yellow-50 p-4 md:p-6 rounded-lg shadow-md">
          <p className="text-xl md:text-3xl font-bold text-yellow-700">{pending}</p>
          <p className="text-xs md:text-sm text-yellow-600">Pending ⏳</p>
        </div>
      </div>

      <form onSubmit={addGuest} className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Add Guest</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Name"
            required
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          />
          <input
            type="email"
            placeholder="Email"
            value={newGuest.email}
            onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          />
          <select
            value={newGuest.side}
            onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          >
            <option value="">Side</option>
            <option value="bride">Bride&apos;s Side</option>
            <option value="groom">Groom&apos;s Side</option>
          </select>
          <select
            value={newGuest.category}
            onChange={(e) => setNewGuest({ ...newGuest, category: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm md:text-base"
          >
            <option value="">Category</option>
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
          </select>
          <button
            type="submit"
            className="bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 text-sm md:text-base"
          >
            Add
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4">All Guests</h3>
        {guests.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">No guests added yet.</p>
        ) : (
          <div className="space-y-2">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-2 md:gap-4 min-w-0">
                  <button
                    onClick={() => toggleRSVP(guest.id)}
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                      guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {guest.rsvp_status === 'confirmed' ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> :
                     guest.rsvp_status === 'declined' ? <XCircle className="w-4 h-4 md:w-5 md:h-5" /> :
                     <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm md:text-base truncate">{guest.name}</p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                      {guest.email} {guest.side && `• ${guest.side}'s side`} {guest.category && `• ${guest.category}`}
                    </p>
                  </div>
                </div>
                <span className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm shrink-0 ${
                  guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {guest.rsvp_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
