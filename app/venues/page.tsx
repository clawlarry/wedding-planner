import db from "@/lib/db";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { MapPin, Phone, Mail, Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function VenuesPage({ searchParams }: { searchParams: { month?: string } }) {
  const currentMonth = searchParams.month ? new Date(searchParams.month) : new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get all venues
  const venues = db.prepare("SELECT * FROM venues ORDER BY viewing_date, viewing_time").all();

  // Get venues with viewings for calendar
  const venuesWithDates = venues.filter((v: any) => v.viewing_date);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Wedding Venues</h2>
        <Link
          href="/venues/new"
          className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-700"
        >
          <Plus className="w-4 h-4" />
          Add Venue
        </Link>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <div className="flex gap-2">
            <Link
              href={`/venues?month=${format(subMonths(currentMonth, 1), "yyyy-MM-dd")}`}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Link
              href={`/venues?month=${format(addMonths(currentMonth, 1), "yyyy-MM-dd")}`}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const dayVenues = venuesWithDates.filter((v: any) =>
              isSameDay(parseISO(v.viewing_date), day)
            );
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] border rounded-lg p-2 ${
                  dayVenues.length > 0 ? "bg-rose-50 border-rose-200" : "border-gray-200"
                }`}
              >
                <p className="text-sm font-medium text-gray-700">{format(day, "d")}</p>
                {dayVenues.map((venue: any) => (
                  <Link
                    key={venue.id}
                    href={`/venues/${venue.id}`}
                    className="text-xs bg-rose-600 text-white px-2 py-1 rounded mt-1 block truncate hover:bg-rose-700"
                  >
                    {venue.viewing_time} - {venue.name}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Venues List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">All Venues</h3>
        {venues.length === 0 ? (
          <p className="text-gray-500">No venues added yet. Add your first venue above!</p>
        ) : (
          <div className="space-y-4">
            {venues.map((venue: any) => (
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
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      {venue.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {venue.phone}
                        </span>
                      )}
                      {venue.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {venue.email}
                        </span>
                      )}
                    </div>
                    {venue.viewing_date && (
                      <p className="text-sm text-rose-600 flex items-center gap-1 mt-2">
                        <Calendar className="w-4 h-4" />
                        Viewing: {format(parseISO(venue.viewing_date), "EEEE, MMMM d")}
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
                {venue.price_range && (
                  <p className="text-sm text-gray-600 mt-2">💰 {venue.price_range}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
