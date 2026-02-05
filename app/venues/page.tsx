"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Globe, Calendar, DollarSign, Users, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("venues") || "[]");
    setVenues(stored);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Wedding Venues</h2>
        <Link
          href="/venues/new"
          className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-700"
        >
          Add Venue
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">All Venues</h3>
        {venues.length === 0 ? (
          <p className="text-gray-500">No venues added yet. Add your first venue!</p>
        ) : (
          <div className="space-y-4">
            {venues.map((venue) => (
              <Link
                key={venue.id}
                href={`/venues/${venue.id}`}
                className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{venue.name}</h4>
                    {venue.address && (
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {venue.address}
                      </p>
                    )}
                    {venue.viewing_date && (
                      <p className="text-sm text-rose-600 flex items-center gap-1 mt-2">
                        <Calendar className="w-4 h-4" />
                        Viewing: {new Date(venue.viewing_date).toLocaleDateString()}
                        {venue.viewing_time && ` at ${venue.viewing_time}`}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
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
