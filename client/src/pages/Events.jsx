import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Search,
} from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/info/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events", err))
      .finally(() => setLoading(false));
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      [event.title, event.category, event.location]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [events, search]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white transition-colors duration-300 relative overflow-x-hidden">
      <Navbar />

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-widest mb-4">
            <Zap size={14} /> Campus Life
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Upcoming Events
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover workshops, cultural fests, and tech symposiums happening
            around you.
          </p>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="max-w-xl mx-auto mb-14">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white dark:bg-[#161b22] border shadow">
            <Search size={20} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by name, category or location..."
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* ================= EVENTS GRID ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

/* ================= EVENT CARD ================= */
const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const dateObj = new Date(event.date);
  const month = dateObj
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = dateObj.getDate();

  return (
    <div className="bg-white dark:bg-[#161b22] rounded-3xl overflow-hidden shadow hover:shadow-xl transition flex flex-col">
      {/* IMAGE */}
      <div className="h-60 relative">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600" />
        )}

        <div className="absolute top-4 left-4 bg-black/50 text-white rounded-xl px-3 py-2 text-center">
          <div className="text-xs font-bold">{month}</div>
          <div className="text-2xl font-black">{day}</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-black mb-3">{event.title}</h3>

        <div className="space-y-2 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <Clock size={14} /> {event.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} /> {event.location}
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
          {event.description}
        </p>

        <button
          onClick={() => navigate(`/events/${event._id}`)}
          className="mt-auto w-full py-3 rounded-xl border font-bold hover:bg-purple-600 hover:text-white transition flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ================= EMPTY STATE ================= */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center opacity-70">
    <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
      <Sparkles className="w-10 h-10 text-slate-400" />
    </div>
    <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
    <p className="text-slate-500">Try searching with different keywords.</p>
  </div>
);

export default Events;
