"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar } from "lucide-react";
import Link from "next/link";

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("venues") || "[]");
    setVenues(stored);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold">Wedding Venues</h2>
        <Link
          href="/venues/new"
          className="bg-rose-600 text-white px-4 py-2 rounded-lg text-center hover:bg-rose-700 text-sm md:text-base"
        >
          + Add Venue
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-semibold mb-4">All Venues</h3>
        {venues.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-base">No venues added yet. Add your first venue!</p>
        ) : (
          <div className="space-y-4">
            {venues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`}
                className="block border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base md:text-lg truncate">{venue.name}</h4>
                    {venue.address && (
                      <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                        <span className="truncate">{venue.address}</span>
                      </p>
                    )}
                    {venue.viewing_date && (
                      <p className="text-xs md:text-sm text-rose-600 flex items-center gap-1 mt-2">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                        Viewing: {new Date(venue.viewing_date).toLocaleDateString()}
                        {venue.viewing_time && ` at ${venue.viewing_time}`}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs md:text-sm shrink-0 self-start ${
                    venue.status === 'booked' ? 'bg-green-100 text-green-700' :
                    venue.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    venue.status === 'visited' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {venue.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
