"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewVenuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    viewing_date: "",
    viewing_time: "",
    price_range: "",
    capacity: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const venues = JSON.parse(localStorage.getItem("venues") || "[]");
    const newVenue = {
      id: Date.now().toString(),
      ...formData,
      status: "interested",
    };
    venues.push(newVenue);
    localStorage.setItem("venues", JSON.stringify(venues));
    router.push("/venues");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Add New Venue</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="e.g., Franciscan Gardens"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Full address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="venue@example.com"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Viewing Schedule</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.viewing_date}
                onChange={(e) => setFormData({ ...formData, viewing_date: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={formData.viewing_time}
                onChange={(e) => setFormData({ ...formData, viewing_time: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 font-semibold"
          >
            Add Venue
          </button>
          <a
            href="/venues"
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold text-center"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
