"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, ArrowLeft, Heart, ThumbsUp, ThumbsDown, Save } from "lucide-react";
import Link from "next/link";

export default function VenueDetailClient({ id }: { id: string }) {
  const [venue, setVenue] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

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
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
  };

  const updateStatus = (newStatus: string) => {
    const venues = JSON.parse(localStorage.getItem("venues") || "[]");
    const updated = venues.map((v: any) =>
      v.id === id ? { ...v, status: newStatus } : v
    );
    localStorage.setItem("venues", JSON.stringify(updated));
    setVenue({ ...venue, status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'visited': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  if (!venue) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <Link href="/venues" className="inline-flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to venues
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center shrink-0">
              <Heart className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">{venue.name}</h2>
              {venue.address && (
                <p className="text-gray-500 flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {venue.address}
                </p>
              )}
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border shrink-0 ${getStatusColor(venue.status)}`}>
            {venue.status}
          </span>
        </div>

        {/* Status Actions */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
          <span className="text-sm font-medium text-gray-500 mr-2 py-2">Update status:</span>
          {['interested', 'visited', 'booked', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                venue.status === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Viewing Schedule */}
      {venue.viewing_date && (
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-rose-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Scheduled Viewing</h3>
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {new Date(venue.viewing_date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {venue.viewing_time && (
            <p className="text-rose-100 text-lg mt-2">at {venue.viewing_time}</p>
          )}
        </div>
      )}

      {/* Contact Info */}
      {(venue.phone || venue.email) && (
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {venue.phone && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-900">{venue.phone}</p>
              </div>
            )}
            {venue.email && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-900">{venue.email}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 md:p-8">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-6">Notes & Review</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              General Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all outline-none resize-none"
              placeholder="Add your thoughts about this venue..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <ThumbsUp className="w-4 h-4 text-emerald-500" />
                Pros
              </label>
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none"
                placeholder="What do you love about this venue?"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <ThumbsDown className="w-4 h-4 text-red-500" />
                Cons
              </label>
              <textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none resize-none"
                placeholder="Any concerns or drawbacks?"
              />
            </div>
          </div>
          
          <button
            onClick={saveNotes}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 hover:-translate-y-0.5 transition-all"
          >
            <Save className="w-5 h-5" />
            {showSaveConfirmation ? 'Saved!' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  );
}
