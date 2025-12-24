import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  X,
  Save,
  ImageIcon,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-toastify";
import adminAPI from "../../services/adminApi"; // ✅ API Service Imported

const Events = () => {
  const [events, setEvents] = useState([]); // ✅ Start empty, fetch from DB
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditingId, setIsEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "General",
    bannerFile: null,
  });

  // --- ✅ 1. FETCH EVENTS FROM DB ---
  useEffect(() => {
    setIsLoading(true);
    adminAPI
      .get("/admin/events")
      .then((res) => setEvents(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch events");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // --- HANDLERS ---
  const handleOpenModal = (eventToEdit = null) => {
    if (eventToEdit) {
      // Format date for input if needed
      const dateStr = eventToEdit.date
        ? new Date(eventToEdit.date).toISOString().split("T")[0]
        : "";

      setFormData({
        title: eventToEdit.title,
        date: dateStr,
        time: eventToEdit.time,
        location: eventToEdit.location,
        description: eventToEdit.description,
        category: eventToEdit.category || "General",
        bannerFile: null,
      });
      setIsEditingId(eventToEdit._id);
    } else {
      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        category: "General",
        bannerFile: null,
      });
      setIsEditingId(null);
    }
    setShowModal(true);
  };

  // --- ✅ 2. SUBMIT TO DB (CREATE / UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info(isEditingId ? "Updating event..." : "Creating event...", {
      autoClose: 1000,
    });

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("time", formData.time);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("category", formData.category);

      // Only append if a file is selected
      if (formData.bannerFile) {
        data.append("banner", formData.bannerFile);
      }

      if (isEditingId) {
        await adminAPI.put(`/admin/events/${isEditingId}`, data);
        toast.success("Event updated successfully! 🚀");
      } else {
        await adminAPI.post("/admin/events", data);
        toast.success("Event created successfully! 🎉");
      }

      // Refresh list
      const res = await adminAPI.get("/admin/events");
      setEvents(res.data);

      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Operation failed. Please check your inputs.");
    }
  };

  // --- ✅ 3. DELETE FROM DB ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await adminAPI.delete(`/admin/events/${id}`);
        setEvents((prev) => prev.filter((e) => e._id !== id));
        toast.success("Event deleted.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete event");
      }
    }
  };

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-violet-500/30 transition-colors duration-300 relative overflow-x-hidden">
      <AdminNavbar />

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 -left-40 w-[800px] h-[800px] bg-violet-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 -right-40 w-[800px] h-[800px] bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-300 tracking-tight flex items-center gap-4 mb-2">
              <CalendarDays className="w-12 h-12 text-violet-500" />
              Events Hub
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium max-w-xl">
              Manage, schedule, and organize upcoming campus activities.
            </p>
          </div>

          {/* Create Button */}
          <button
            onClick={() => handleOpenModal()}
            className="group relative overflow-hidden rounded-2xl py-4 px-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              Create New Event
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-0"></div>
          </button>
        </div>

        {/* ================= TOOLBAR ================= */}
        <div
          className="sticky top-24 z-30 mb-10 p-2 rounded-[1.5rem] bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-violet-500/5 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="relative group">
            <Search className="absolute left-5 top-4 w-6 h-6 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
            <input
              placeholder="Search events by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-transparent text-slate-900 dark:text-white text-lg placeholder-slate-400 outline-none focus:bg-white/50 dark:focus:bg-[#0d1117]/50 transition-all"
            />
          </div>
        </div>

        {/* ================= EVENTS GRID ================= */}
        {isLoading ? (
          <div className="flex justify-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onEdit={() => handleOpenModal(event)}
                onDelete={() => handleDelete(event._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-60">
            <Sparkles className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-500">
              No Upcoming Events
            </h3>
            <p className="text-slate-400">Time to plan something exciting!</p>
          </div>
        )}
      </main>

      {/* ================= CREATE/EDIT MODAL ================= */}
      {showModal && (
        <EventModal
          isEditing={!!isEditingId}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

/* ================= COMPONENT: Event Card ================= */
const EventCard = ({ event, onEdit, onDelete }) => {
  const dateObj = new Date(event.date);
  const month = dateObj
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = dateObj.getDate();

  return (
    <div className="group relative bg-white/60 dark:bg-[#161b22]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/20 flex flex-col h-full">
      <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent group-hover:border-violet-500/30 transition-colors duration-500 pointer-events-none z-20"></div>

      {/* Banner */}
      <div className="h-52 relative overflow-hidden shrink-0">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-500 opacity-80 group-hover:scale-110 transition-transform duration-700 relative overflow-hidden">
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 w-20 h-20" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-50 mix-blend-overlay"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090c10] via-[#090c10]/40 to-transparent opacity-80"></div>

        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl p-3 text-center min-w-[70px] shadow-lg z-10">
          <span className="block text-xs font-bold tracking-widest opacity-80">
            {month}
          </span>
          <span className="block text-3xl font-black leading-tight">{day}</span>
        </div>

        {event.category && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-wider z-10">
            {event.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 pt-8 flex flex-col flex-1 relative z-10 -mt-10 rounded-t-[2.5rem] bg-white/80 dark:bg-[#161b22]/95 backdrop-blur-xl border-t border-white/20 dark:border-white/5">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {event.title}
        </h3>

        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4 text-violet-500" />
            {event.time}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 truncate">
            <MapPin className="w-4 h-4 text-fuchsia-500" />
            {event.location}
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {event.description}
        </p>

        <div className="flex gap-2 pt-4 border-t border-slate-200/50 dark:border-white/10">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
          >
            <Edit2 size={16} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENT: Event Modal ================= */
const EventModal = ({
  isEditing,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, bannerFile: e.target.files[0] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md animate-in fade-in duration-300 flex justify-center pt-28 px-4">
      <div
        className="relative w-full max-w-2xl bg-white/80 dark:bg-[#161b22]/90 backdrop-blur-2xl rounded-[2.5rem] shadow-3xl overflow-hidden border border-white/20 flex flex-col"
        style={{ maxHeight: "calc(100vh - 8rem)" }}
      >
        <div className="h-24 bg-gradient-to-r from-violet-600 to-fuchsia-600 relative shrink-0 flex items-center px-8">
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            {isEditing ? (
              <Edit2 className="w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
            {isEditing ? "Edit Event Details" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-8 overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-6">
            <GlassInput
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Annual Tech Fest"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <GlassInput
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassInput
                label="Location/Venue"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Main Auditorium"
                required
                icon={MapPin}
              />

              <div className="group">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none transition-all"
                  >
                    <option value="General" className="dark:bg-[#161b22]">
                      General
                    </option>
                    <option value="Academic" className="dark:bg-[#161b22]">
                      Academic
                    </option>
                    <option value="Cultural" className="dark:bg-[#161b22]">
                      Cultural
                    </option>
                    <option value="Workshop" className="dark:bg-[#161b22]">
                      Workshop
                    </option>
                    <option value="Sports" className="dark:bg-[#161b22]">
                      Sports
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Event details, agenda, etc..."
                rows={4}
                className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-all"
                required
              />
            </div>

            <div className="group">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Event Banner Image (Optional)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-[#0d1117]/30 hover:bg-violet-50 dark:hover:bg-violet-900/10 hover:border-violet-400 transition-all cursor-pointer group/file">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 text-slate-400 group-hover/file:text-violet-500 mb-2 transition-colors" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-violet-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formData.bannerFile
                      ? formData.bannerFile.name
                      : "PNG, JPG up to 5MB"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-lg shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Save size={20} />
            {isEditing ? "Update Event" : "Publish Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

const GlassInput = ({ label, icon: Icon, ...props }) => (
  <div className="group">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block pl-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-violet-500 transition-colors" />
      )}
      <input
        {...props}
        className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-violet-500/50 transition-all ${
          Icon ? "pl-12" : ""
        }`}
      />
    </div>
  </div>
);

export default Events;
