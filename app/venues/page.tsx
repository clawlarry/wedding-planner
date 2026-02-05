"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Plus, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = JSON.parse(localStorage.getItem("venues") || "[]");
    setVenues(stored);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'visited': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const interestedVenues = venues.filter(v => v.status !== 'booked' && v.status !== 'rejected');
  const bookedVenue = venues.find(v => v.status === 'booked');

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Wedding Venues</h2>
          <p className="text-gray-500 mt-1">Find the perfect place for your special day</p>
        </div>
        <Link
          href="/venues/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Venue
        </Link>
      </div>

      {/* Booked Venue Highlight */}
      {bookedVenue && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 md:p-8 shadow-xl shadow-emerald-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Star className="w-8 h-8 fill-white" />
            </div>
            <div>
              <p className="text-emerald-100 font-medium">Venue Booked! 🎉</p>
              <h3 className="text-2xl font-bold">{bookedVenue.name}</h3>
              {bookedVenue.address && (
                <p className="text-emerald-100 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {bookedVenue.address}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Venues List */}
      {venues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg shadow-gray-200/50">
          <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-rose-300" />
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">No venues yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Start your venue search by adding the first place you&apos;re interested in visiting.</p>
          <Link
            href="/venues/new"
            className="inline-flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700"
          >
            Add your first venue
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {venues.map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="group bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-rose-100/50 border border-transparent hover:border-rose-100 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7 text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif text-lg font-bold text-gray-900 group-hover:text-rose-700 transition-colors">
                      {venue.name}
                    </h4>
                    {venue.address && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{venue.address}</span>
                      </p>
                    )}
                    {venue.viewing_date && (
                      <p className="text-sm text-rose-600 flex items-center gap-1 mt-2">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        Viewing: {new Date(venue.viewing_date).toLocaleDateString()}
                        {venue.viewing_time && ` at ${venue.viewing_time}`}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border shrink-0 ${getStatusColor(venue.status)}`}>
                  {venue.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
