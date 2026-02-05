import db from "@/lib/db";
import { format, parseISO } from "date-fns";
import { MapPin, Phone, Mail, Globe, Calendar, DollarSign, Users, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function addPhoto(formData: FormData) {
  "use server";
  const venueId = formData.get("venueId");
  const caption = formData.get("caption");
  // Handle file upload here
  redirect(`/venues/${venueId}`);
}

async function updateNotes(formData: FormData) {
  "use server";
  const venueId = formData.get("venueId");
  const notes = formData.get("notes");
  const pros = formData.get("pros");
  const cons = formData.get("cons");
  
  const stmt = db.prepare(
    "UPDATE venues SET notes = ?, pros = ?, cons = ? WHERE id = ?"
  );
  stmt.run(notes, pros, cons, venueId);
  redirect(`/venues/${venueId}`);
}

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const venue = db.prepare("SELECT * FROM venues WHERE id = ?").get(params.id) as any;
  const photos = db.prepare("SELECT * FROM venue_photos WHERE venue_id = ?").all(params.id) as any[];

  if (!venue) {
    return <div>Venue not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/venues" className="flex items-center gap-2 text-rose-600 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Venues
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold">{venue.name}</h2>
          {venue.address && (
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <MapPin className="w-5 h-5" />
              {venue.address}
            </p>
          )}
        </div>
        <span className={`px-4 py-2 rounded-full ${
          venue.status === 'booked' ? 'bg-green-100 text-green-700' :
          venue.status === 'rejected' ? 'bg-red-100 text-red-700' :
          venue.status === 'visited' ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {venue.status}
        </span>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-3 gap-4">
          {venue.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{venue.phone}</span>
            </div>
          )}
          {venue.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href={`mailto:${venue.email}`} className="text-rose-600 hover:underline">
                {venue.email}
              </a>
            </div>
          )}
          {venue.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <a href={venue.website} target="_blank" className="text-rose-600 hover:underline">
                Website
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Viewing Details */}
      {venue.viewing_date && (
        <div className="bg-rose-50 rounded-lg p-6 border border-rose-200">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            Scheduled Viewing
          </h3>
          <p className="text-lg">
            {format(parseISO(venue.viewing_date), "EEEE, MMMM d, yyyy")}
            {venue.viewing_time && ` at ${venue.viewing_time}`}
          </p>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-6">
        {venue.price_range && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              Price Range
            </h3>
            <p className="text-2xl font-bold text-gray-800">{venue.price_range}</p>
          </div>
        )}
        {venue.capacity && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              Capacity
            </h3>
            <p className="text-2xl font-bold text-gray-800">{venue.capacity}</p>
          </div>
        )}
      </div>

      {/* Photos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Photos</h3>
        {photos.length === 0 ? (
          <p className="text-gray-500">No photos added yet.</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {photos.map((photo: any) => (
              <div key={photo.id} className="relative">
                <img
                  src={photo.photo_path}
                  alt={photo.caption || "Venue photo"}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {photo.caption && (
                  <p className="text-sm text-gray-600 mt-2">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}
        <form action={addPhoto} className="mt-4 flex gap-4">
          <input type="hidden" name="venueId" value={venue.id} />
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="caption"
            placeholder="Caption (optional)"
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-700"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </form>
      </div>

      {/* Notes & Pros/Cons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Notes</h3>
        <form action={updateNotes} className="space-y-4">
          <input type="hidden" name="venueId" value={venue.id} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Notes
            </label>
            <textarea
              name="notes"
              defaultValue={venue.notes || ""}
              rows={4}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Add your thoughts about this venue..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pros ✅
              </label>
              <textarea
                name="pros"
                defaultValue={venue.pros || ""}
                rows={3}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="What do you love about this venue?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cons ❌
              </label>
              <textarea
                name="cons"
                defaultValue={venue.cons || ""}
                rows={3}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Any concerns or drawbacks?"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700"
          >
            Save Notes
          </button>
        </form>
      </div>
    </div>
  );
}
