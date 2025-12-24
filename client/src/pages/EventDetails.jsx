import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { Calendar, Clock, MapPin } from "lucide-react";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/info/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Failed to load event", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090c10]">
        <Navbar />
        <div className="h-24" />
        <p className="text-center mt-20 text-slate-500">Loading event...</p>
      </div>
    );
  }

  if (!event) return null;

  const dateObj = new Date(event.date);
  const date = dateObj.toDateString();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white">
      <Navbar />

      {/* ✅ FIX: space for fixed navbar */}
      <div className="h-24" />

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* ================= IMAGE SECTION ================= */}
        {event.banner && (
          <div className="mb-10 rounded-3xl overflow-hidden bg-white dark:bg-[#161b22] shadow-lg">
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-auto max-h-[420px] object-contain"
            />
          </div>
        )}

        {/* ================= EVENT INFO ================= */}
        <div className="bg-white dark:bg-[#161b22] rounded-3xl p-8 shadow border border-slate-200 dark:border-slate-800">
          <h1 className="text-4xl font-black mb-6">{event.title}</h1>

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={18} />
              <span>{date}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="text-purple-600" size={18} />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-pink-600" size={18} />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Category */}
          {event.category && (
            <span className="inline-block mb-6 px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">
              {event.category}
            </span>
          )}

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
