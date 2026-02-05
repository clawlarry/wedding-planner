"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VenueDetailClient({ id }: { id: string }) {
  const [venue, setVenue] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");

  useEffect(() => {
    const venues = JSON.parse(localStorage.getItem("venues") || "[]");
    const found = venues.find((v: any) => v.id === id);
    if (found) {
      setVenue(found);
      setNotes(found.notes || "");
      setPros(found.pros || "");
      setCons(found.cons || "");
    }
  }, [id]);

  const saveNotes = () => {
    const venues = JSON.parse(localStorage.getItem("venues") || "[]");
    const updated = venues.map((v: any) =>
      v.id === id ? { ...v, notes, pros, cons } : v
    );
    localStorage.setItem("venues", JSON.stringify(updated));
    alert("Notes saved!");
  };

  if (!venue) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4 md:space-y-6">
      <Link href="/venues" className="flex items-center gap-2 text-rose-600 hover:underline text-sm md:text-base">
        <ArrowLeft className="w-4 h-4" />
        Back to Venues
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl md:text-3xl font-bold break-words">{venue.name}</h2>
          {venue.address && (
            <p className="text-gray-600 flex items-center gap-2 mt-2 text-sm md:text-base">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              <span className="break-words">{venue.address}</span>
            </p>
          )}
        </div>
        <span className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm shrink-0 self-start ${
          venue.status === 'booked' ? 'bg-green-100 text-green-700' :
          venue.status === 'rejected' ? 'bg-red-100 text-red-700' :
          venue.status === 'visited' ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {venue.status}
        </span>
      </div>

      {venue.viewing_date && (
        <div className="bg-rose-50 rounded-lg p-4 md:p-6 border border-rose-200">
          <h3 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-rose-600" />
            Scheduled Viewing
          </h3>
          <p className="text-base md:text-lg">
            {new Date(venue.viewing_date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            {venue.viewing_time && ` at ${venue.viewing_time}`}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4">Notes</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 text-sm md:text-base"
              placeholder="Add your thoughts about this venue..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pros ✅
              </label>
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm md:text-base"
                placeholder="What do you love about this venue?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cons ❌
              </label>
              <textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm md:text-base"
                placeholder="Any concerns or drawbacks?"
              />
            </div>
          </div>
          <button
            onClick={saveNotes}
            className="bg-rose-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-rose-700 text-sm md:text-base"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
