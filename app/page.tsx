import db from "@/lib/db";
import { format, parseISO, isFuture, isPast } from "date-fns";
import { Calendar, MapPin, Users, CheckCircle, Clock } from "lucide-react";

export default function Dashboard() {
  // Get stats
  const venueCount = (db.prepare("SELECT COUNT(*) as count FROM venues").get() as any).count;
  const taskCount = (db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status != 'completed'").get() as any).count;
  const guestCount = (db.prepare("SELECT COUNT(*) as count FROM guests").get() as any).count;
  const confirmedGuests = (db.prepare("SELECT COUNT(*) as count FROM guests WHERE rsvp_status = 'confirmed'").get() as any).count;

  // Get upcoming venue viewings
  const upcomingVenues = db.prepare(
    "SELECT * FROM venues WHERE viewing_date IS NOT NULL ORDER BY viewing_date, viewing_time LIMIT 5"
  ).all();

  // Get recent tasks
  const recentTasks = db.prepare(
    "SELECT * FROM tasks WHERE status != 'completed' ORDER BY due_date LIMIT 5"
  ).all();

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-800">Our Wedding Planning</h2>
        <p className="text-gray-600 mt-2">Let's plan the perfect day together 💕</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-rose-500">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-rose-500" />
            <div>
              <p className="text-2xl font-bold">{venueCount}</p>
              <p className="text-sm text-gray-600">Venues</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{taskCount}</p>
              <p className="text-sm text-gray-600">Tasks To Do</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{confirmedGuests}/{guestCount}</p>
              <p className="text-sm text-gray-600">Guests Confirmed</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{upcomingVenues.length}</p>
              <p className="text-sm text-gray-600">Upcoming Viewings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Viewings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            Upcoming Venue Viewings
          </h3>
          {upcomingVenues.length === 0 ? (
            <p className="text-gray-500">No upcoming viewings scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingVenues.map((venue: any) => (
                <div key={venue.id} className="border-l-4 border-rose-400 pl-4 py-2 bg-rose-50 rounded">
                  <p className="font-semibold">{venue.name}</p>
                  <p className="text-sm text-gray-600">
                    {venue.viewing_date && format(parseISO(venue.viewing_date), "EEEE, MMMM d")}
                    {venue.viewing_time && ` at ${venue.viewing_time}`}
                  </p>
                  {venue.address && <p className="text-xs text-gray-500">{venue.address}</p>}
                </div>
              ))}
            </div>
          )}
          <a href="/venues" className="text-rose-600 text-sm mt-4 inline-block hover:underline">
            View all venues →
          </a>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Tasks To Complete
          </h3>
          {recentTasks.length === 0 ? (
            <p className="text-gray-500">All caught up! No pending tasks.</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task: any) => (
                <div key={task.id} className="flex items-start gap-3 border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    {task.due_date && (
                      <p className="text-xs text-gray-500">
                        Due: {format(parseISO(task.due_date), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
          <a href="/tasks" className="text-blue-600 text-sm mt-4 inline-block hover:underline">
            View all tasks →
          </a>
        </div>
      </div>
    </div>
  );
}
