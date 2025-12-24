import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Users,
  Search,
  Building2,
  GraduationCap,
  X,
  Sparkles,
  BookOpen,
  Clock,
  ChevronRight,
  Filter,
  Zap,
} from "lucide-react";

const getPosition = (s) =>
  s.position || s.designation || s.role || "Faculty Member";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = () => {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:5000/api/info/staff", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setStaff(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response?.status === 401) navigate("/login");
        });
    };
    fetchStaff();
  }, [navigate]);

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (department === "" || s.department === department)
  );

  return (
    // Base: Slate-50 for Light Mode, Deep Blue/Black for Dark Mode
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B0C15] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* --- GRID BACKGROUND PATTERN --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* The Grid: Light Grey in Light Mode, Dark Blue in Dark Mode */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#23263a_1px,transparent_1px),linear-gradient(to_bottom,#23263a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto pt-32 px-6 pb-20">
        {/* --- GLOSSY HEADER --- */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
          <div className="flex items-center gap-5">
            {/* Fancy Icon Box */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <div className="relative w-16 h-16 rounded-2xl bg-white dark:bg-[#13151f] ring-1 ring-slate-200 dark:ring-white/10 flex items-center justify-center shadow-2xl">
                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
                Faculty{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-400 dark:to-emerald-400">
                  Hub
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm tracking-wide flex items-center gap-2">
                <Zap
                  size={14}
                  className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400"
                />
                Explore innovation across campus.
              </p>
            </div>
          </div>

          {/* --- SEARCH & FILTER BAR --- */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto bg-white/60 dark:bg-[#13151f]/50 p-2 rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-md shadow-xl">
            {/* Search */}
            <div className="relative flex-1 sm:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-500 outline-none rounded-2xl focus:bg-slate-100 dark:focus:bg-white/5 transition-all"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-[1px] bg-slate-200 dark:bg-white/10 my-2" />

            {/* Filter */}
            <div className="relative sm:w-48 group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-9 pr-8 py-3 bg-transparent text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors appearance-none rounded-2xl focus:bg-slate-100 dark:focus:bg-white/5"
              >
                {/* Options background fixed for both modes */}
                <option
                  value=""
                  className="bg-white dark:bg-[#13151f] text-slate-900 dark:text-white"
                >
                  All Departments
                </option>
                {["CSE", "ECE", "EEE", "MECH", "CIVIL"].map((d) => (
                  <option
                    key={d}
                    value={d}
                    className="bg-white dark:bg-[#13151f] text-slate-900 dark:text-white"
                  >
                    {d}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 rotate-90 text-slate-400 dark:text-slate-600 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* --- CARD GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-72 bg-slate-200 dark:bg-white/5 rounded-[2rem] animate-pulse border border-transparent dark:border-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStaff.map((s) => (
              <StaffCard
                key={s._id}
                s={s}
                onClick={() => setSelectedStaff(s)}
              />
            ))}
          </div>
        )}
      </main>

      {/* --- DETAIL PANEL --- */}
      {selectedStaff && (
        <StaffDetailPanel
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
};

// --- REDESIGNED GLOSSY CARD ---
const StaffCard = ({ s, onClick }) => (
  <div
    onClick={onClick}
    // Card Base: White in Light Mode, Dark in Dark Mode. Added Borders and Shadows.
    className="group relative bg-white dark:bg-[#181a25] hover:bg-slate-50 dark:hover:bg-[#1c1f2e] rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1"
  >
    {/* Top Gradient Line */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

    {/* Header Section */}
    <div className="flex items-start justify-between mb-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-white/10 group-hover:ring-indigo-500/50 transition-all shadow-lg bg-slate-100 dark:bg-slate-800">
          {s.photo ? (
            <img
              src={s.photo}
              alt={s.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-900 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-white">
              {s.name[0]}
            </div>
          )}
        </div>
        {/* Online/Status Dot */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-[#181a25] rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
      </div>

      {/* Department Badge */}
      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase shadow-sm">
        {s.department}
      </span>
    </div>

    {/* Info Section */}
    <div className="space-y-1 mb-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
        {s.name}
      </h3>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
        {getPosition(s)}
      </p>
    </div>

    {/* Action Footer */}
    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
      <div className="flex gap-3 text-slate-500">
        <div className="flex items-center gap-1 text-xs font-semibold group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
          <Clock size={14} /> <span>Active</span>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
        <ChevronRight size={16} />
      </div>
    </div>
  </div>
);

// --- REDESIGNED MODAL ---
const StaffDetailPanel = ({ staff, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/80 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white dark:bg-[#13151f] h-auto max-h-[85vh] md:h-[550px] rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Left Side: Profile */}
        <div className="w-full md:w-[35%] bg-slate-50 dark:bg-[#0e1016] p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/5 to-transparent opacity-50" />

          <div className="relative z-10">
            <div className="w-40 h-40 mx-auto rounded-[2rem] p-1 bg-gradient-to-br from-indigo-500 to-cyan-500 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-white dark:bg-[#0e1016]">
                {staff.photo ? (
                  <img
                    src={staff.photo}
                    className="w-full h-full object-cover"
                    alt={staff.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-slate-400 dark:text-white bg-slate-100 dark:bg-slate-800">
                    {staff.name[0]}
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {staff.name}
            </h2>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-6 shadow-sm">
              <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-[10px]">
                {getPosition(staff)}
              </p>
            </div>

            <div className="flex justify-center gap-3 w-full">
              <div className="flex flex-col items-center p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 min-w-[80px] shadow-sm">
                <Building2
                  size={18}
                  className="text-slate-500 dark:text-slate-400 mb-1"
                />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  {staff.department}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 min-w-[80px] shadow-sm">
                <Clock
                  size={18}
                  className="text-emerald-500 dark:text-emerald-400 mb-1"
                />
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  {staff.experience || "0"} Yrs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 p-8 md:p-12 bg-white dark:bg-[#13151f] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white transition-all"
          >
            <X size={20} />
          </button>

          <div className="space-y-8 mt-4">
            {/* Bio Section */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
                <Sparkles size={14} /> About Faculty
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-light">
                "{staff.name} is a dedicated professional in the{" "}
                <span className="text-slate-900 dark:text-white font-medium">
                  {staff.department}
                </span>{" "}
                department, committed to academic excellence and student
                growth."
              </p>
            </div>

            {/* Credentials */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B0C15] border border-slate-200 dark:border-white/5 shadow-inner">
              <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                <GraduationCap size={14} /> Qualification
              </h4>
              <p className="text-xl font-bold text-slate-800 dark:text-white">
                {staff.qualification || "Not Specified"}
              </p>
            </div>

            {/* Tags/Expertise */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                <BookOpen size={14} /> Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Mentorship", "Research", "Academics", "Innovation"].map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
