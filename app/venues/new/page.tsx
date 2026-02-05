import db from "@/lib/db";
import { redirect } from "next/navigation";

async function createVenue(formData: FormData) {
  "use server";
  
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const website = formData.get("website") as string;
  const viewing_date = formData.get("viewing_date") as string;
  const viewing_time = formData.get("viewing_time") as string;
  const price_range = formData.get("price_range") as string;
  const capacity = formData.get("capacity") as string;
  const notes = formData.get("notes") as string;

  const stmt = db.prepare(`
    INSERT INTO venues (name, address, phone, email, website, viewing_date, viewing_time, price_range, capacity, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'interested')
  `);
  
  const result = stmt.run(name, address, phone, email, website, viewing_date, viewing_time, price_range, capacity, notes);
  redirect("/venues");
}

export default function NewVenuePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Add New Venue</h2>
      
      <form action={createVenue} className="space-y-6 bg-white rounded-lg shadow-md p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue Name *
          </label>
          <input
            type="text"
            name="name"
            required
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
            name="address"
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
              name="phone"
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
              name="email"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="venue@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="https://..."
          />
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
                name="viewing_date"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                name="viewing_time"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <input
                type="text"
                name="price_range"
                className="w-full border rounded-lg px-4 py-2"
                placeholder="e.g., $5,000 - $10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="text"
                name="capacity"
                className="w-full border rounded-lg px-4 py-2"
                placeholder="e.g., 150 guests"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Any initial thoughts or questions..."
          />
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
