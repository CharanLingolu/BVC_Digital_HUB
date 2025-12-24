import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  Calendar as CalendarIcon,
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-purple-500/30 transition-colors duration-300 relative overflow-x-hidden">
      <Navbar />

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-widest mb-4 border border-purple-200 dark:border-purple-700/50">
            <Zap size={14} className="fill-current" /> Campus Life
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white tracking-tight mb-6">
            Upcoming Events
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover workshops, cultural fests, and tech symposiums happening
            around you.
          </p>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="max-w-xl mx-auto mb-14 animate-fade-in-up">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg">
              <Search className="text-slate-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events by name, category or location..."
                className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* ================= EVENTS GRID ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
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
  const dateObj = new Date(event.date);
  const month = dateObj
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = dateObj.getDate();

  return (
    <div className="group relative bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col h-full cursor-default">
      <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent group-hover:border-purple-500/30 transition-colors pointer-events-none z-20"></div>

      <div className="h-64 relative overflow-hidden shrink-0">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 group-hover:scale-110 transition-transform duration-700 relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#090c10] via-transparent to-transparent opacity-90"></div>

        <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-3 text-center min-w-[70px] shadow-lg z-30">
          <span className="block text-xs font-bold tracking-widest opacity-80">
            {month}
          </span>
          <span className="block text-3xl font-black leading-tight">{day}</span>
        </div>

        {event.category && (
          <span className="absolute top-5 right-5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-wider z-30">
            {event.category}
          </span>
        )}
      </div>

      <div className="p-8 pt-4 flex flex-col flex-1 relative z-10 -mt-12">
        <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-slate-200/90">
            <div className="p-1.5 rounded-lg bg-white/10">
              <Clock size={14} className="text-purple-300" />
            </div>
            {event.time}
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-200/90">
            <div className="p-1.5 rounded-lg bg-white/10">
              <MapPin size={14} className="text-pink-300" />
            </div>
            {event.location}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-slate-400 text-sm line-clamp-3 mb-4">
            {event.description}
          </p>

          <button className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-sm hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
            View Details
            <ArrowRight
              size={16}
              className="group-hover/btn:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= EMPTY STATE ================= */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center opacity-70">
    <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
      <Sparkles className="w-10 h-10 text-slate-400" />
    </div>
    <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
    <p className="text-slate-500">Try searching with different keywords.</p>
  </div>
);

export default Events;
