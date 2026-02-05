import db from "@/lib/db";
import { Users, CheckCircle, XCircle, HelpCircle, Plus } from "lucide-react";
import { redirect } from "next/navigation";

async function toggleRSVP(formData: FormData) {
  "use server";
  const id = formData.get("id");
  const status = formData.get("status") as string;
  
  const newStatus = status === "confirmed" ? "declined" : status === "declined" ? "pending" : "confirmed";
  
  db.prepare("UPDATE guests SET rsvp_status = ? WHERE id = ?").run(newStatus, id);
  redirect("/guests");
}

async function addGuest(formData: FormData) {
  "use server";
  const name = formData.get("name");
  const email = formData.get("email");
  const side = formData.get("side");
  const category = formData.get("category");
  
  db.prepare(
    "INSERT INTO guests (name, email, side, category) VALUES (?, ?, ?, ?)"
  ).run(name, email, side, category);
  redirect("/guests");
}

export default function GuestsPage() {
  const guests = db.prepare("SELECT * FROM guests ORDER BY side, name").all();
  
  const totalGuests = guests.length;
  const confirmed = guests.filter((g: any) => g.rsvp_status === "confirmed").length;
  const declined = guests.filter((g: any) => g.rsvp_status === "declined").length;
  const pending = guests.filter((g: any) => g.rsvp_status === "pending").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Guest List</h2>
        <a
          href="https://sheets.google.com"
          target="_blank"
          className="text-rose-600 hover:underline text-sm"
        >
          Import from Google Sheets →
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-3xl font-bold">{totalGuests}</p>
          <p className="text-sm text-gray-600">Total Invited</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
          <p className="text-3xl font-bold text-green-700">{confirmed}</p>
          <p className="text-sm text-green-600">Confirmed ✅</p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
          <p className="text-3xl font-bold text-red-700">{declined}</p>
          <p className="text-sm text-red-600">Declined ❌</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
          <p className="text-3xl font-bold text-yellow-700">{pending}</p>
          <p className="text-sm text-yellow-600">Pending ⏳</p>
        </div>
      </div>

      {/* Add Guest */}
      <form action={addGuest} className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Guest
        </h3>
        <div className="grid grid-cols-5 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded-lg px-4 py-2"
          />
          <select name="side" className="border rounded-lg px-4 py-2">
            <option value="">Side</option>
            <option value="bride">Bride's Side</option>
            <option value="groom">Groom's Side</option>
            <option value="both">Both</option>
          </select>
          <select name="category" className="border rounded-lg px-4 py-2">
            <option value="">Category</option>
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
            <option value="other">Other</option>
          </select>
          <button
            type="submit"
            className="bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700"
          >
            Add
          </button>
        </div>
      </form>

      {/* Guest List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">All Guests</h3>
        {guests.length === 0 ? (
          <p className="text-gray-500">No guests added yet. Add guests above or import from Google Sheets.</p>
        ) : (
          <div className="space-y-2">
            {guests.map((guest: any) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-600' :
                    guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {guest.rsvp_status === 'confirmed' ? <CheckCircle className="w-5 h-5" /> :
                     guest.rsvp_status === 'declined' ? <XCircle className="w-5 h-5" /> :
                     <HelpCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold">{guest.name}</p>
                    <div className="flex gap-2 text-sm text-gray-500">
                      {guest.email && <span>{guest.email}</span>}
                      {guest.side && <span>• {guest.side}'s side</span>}
                      {guest.category && <span>• {guest.category}</span>}
                    </div>
                  </div>
                </div>
                <form action={toggleRSVP}>
                  <input type="hidden" name="id" value={guest.id} />
                  <input type="hidden" name="status" value={guest.rsvp_status} />
                  <button
                    type="submit"
                    className={`px-3 py-1 rounded text-sm ${
                      guest.rsvp_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {guest.rsvp_status}
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
