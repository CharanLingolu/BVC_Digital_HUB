import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import StaffCard from "../components/StaffCard";
import {
  Users,
  Search,
  Building2,
  GraduationCap,
  X,
  Sparkles,
  BookOpen,
  Clock,
  Filter,
  Zap,
  Mail,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper to handle both string and array formats for subjects from Admin
const normalizeSubjects = (subjects) => {
  if (!subjects) return [];
  if (Array.isArray(subjects)) return subjects;
  if (typeof subjects === "string")
    return subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

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

      // ✅ 2. Replace the hardcoded string with the dynamic variable
      axios
        .get(`${API_BASE_URL}/info/staff`, {
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0B0C15] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      <Navbar />

      {/* --- SCROLLBAR & CLIPPING FIXES --- */}
      <style>{`
        /* 1. SHORTEN THE TRACK TO STOP BEFORE CORNER CURVES */
        .custom-scrollbar::-webkit-scrollbar-track { 
          background: transparent; 
          margin-block: 65px; 
        }

        .custom-scrollbar::-webkit-scrollbar { 
          width: 16px; 
        }

        /* 2. FLOATING INSET THUMB */
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: rgba(99, 102, 241, 0.3); 
          /* Thick 6px border pushes the bar AWAY from the edge */
          border: 6px solid transparent; 
          background-clip: content-box; 
          border-radius: 20px; 
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb { 
          background-color: rgba(255, 255, 255, 0.15); 
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(99, 102, 241, 0.5);
        }

        /* 3. RADIAL MASK HACK TO FORCE CLIPPING */
        .panel-force-clip {
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          mask-image: radial-gradient(white, black);
        }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#23263a_1px,transparent_1px),linear-gradient(to_bottom,#23263a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto pt-28 md:pt-32 px-6 pb-40 md:pb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white dark:bg-[#13151f] ring-1 ring-slate-200 dark:ring-white/10 flex items-center justify-center shadow-2xl">
                <Users className="w-7 h-7 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-1 uppercase">
                Faculty{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-400 dark:to-emerald-400">
                  Hub
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm tracking-wide flex items-center gap-2">
                <Zap
                  size={14}
                  className="text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400"
                />
                Explore innovation across campus.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto bg-white/60 dark:bg-[#13151f]/50 p-2 rounded-[1.5rem] md:rounded-3xl border border-slate-200 dark:border-white/5 backdrop-blur-md shadow-xl">
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

            <div className="hidden sm:block w-[1px] bg-slate-200 dark:bg-white/10 my-2" />

            <div className="relative sm:w-48 group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ colorScheme: "dark" }} // FIX FOR THEME
                className="w-full pl-9 pr-8 py-3 bg-transparent text-sm font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors appearance-none rounded-2xl focus:bg-slate-100 dark:focus:bg-white/5"
              >
                <option value="" className="bg-white dark:bg-[#13151f]">
                  All Departments
                </option>
                {["CSE", "ECE", "EEE", "MECH", "CIVIL"].map((d) => (
                  <option
                    key={d}
                    value={d}
                    className="bg-white dark:bg-[#13151f]"
                  >
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {selectedStaff && (
        <StaffDetailPanel
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
};

const StaffDetailPanel = ({ staff, onClose }) => {
  const getPos = (s) =>
    s.position || s.designation || s.role || "Faculty Member";

  const subjects = normalizeSubjects(staff.subjects);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 backdrop-blur-md">
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/80 transition-opacity"
        onClick={onClose}
      />
      {/* 1. MASK HACK APPLIED HERE TO PREVENT SCROLLBAR BLEEDING */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#13151f] h-auto max-h-[92vh] md:h-[550px] rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-200 panel-force-clip">
        {/* Left Profile Section */}
        <div className="w-full md:w-[35%] bg-slate-50 dark:bg-[#0e1016] p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 relative shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-[2.5rem] p-1 bg-gradient-to-br from-indigo-500 to-cyan-500 mb-5 shadow-2xl">
            <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-white dark:bg-[#0e1016]">
              {staff.photo ? (
                <img
                  src={staff.photo}
                  className="w-full h-full object-cover"
                  alt={staff.name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-black text-slate-400 bg-slate-100 dark:bg-slate-800">
                  {staff.name ? staff.name[0] : "?"}
                </div>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight uppercase truncate w-full px-2">
            {staff.name}
          </h2>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-6">
            <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
              {getPos(staff)}
            </p>
          </div>
          <div className="flex justify-center gap-3 w-full">
            <div className="flex flex-col items-center p-3 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 min-w-[85px] shadow-sm">
              <Building2 size={16} className="text-slate-400 mb-1" />
              <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase truncate w-full px-1">
                {staff.department}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 min-w-[85px] shadow-sm">
              <Clock size={16} className="text-emerald-500 mb-1" />
              <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase">
                {staff.experience || "0"} Yrs Exp
              </span>
            </div>
          </div>
        </div>

        {/* 2. SCROLLABLE AREA WITH OVERFLOW-X-HIDDEN FIX */}
        <div className="flex-1 p-8 md:p-12 bg-white dark:bg-[#13151f] overflow-y-auto overflow-x-hidden relative custom-scrollbar pb-16 md:pb-12">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white transition-all z-20 shadow-md border border-slate-200 dark:border-white/10"
          >
            <X size={20} />
          </button>

          <div className="space-y-8 mt-4 md:mt-0">
            {/* Real-time Biography */}
            <div>
              <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-3">
                <Sparkles size={14} /> About Faculty
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed font-light italic">
                "
                {staff.bio ||
                  `${staff.name} is a dedicated professional in the ${staff.department} department.`}
                "
              </p>
            </div>

            {/* Real-time Qualification */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0B0C15] border border-slate-200 dark:border-white/5 shadow-inner">
              <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                <GraduationCap size={16} /> Qualification
              </h4>
              <p className="text-lg md:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                {staff.qualification || "Not Specified"}
              </p>
            </div>

            {/* Real-time Contact Data */}
            {staff.email && (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0B0C15] border border-slate-200 dark:border-white/5 flex items-center gap-4 shadow-inner">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-emerald-500 border border-slate-100 dark:border-white/10">
                  <Mail size={18} />
                </div>
                <div className="truncate">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Email
                  </h4>
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {staff.email}
                  </p>
                </div>
              </div>
            )}

            {/* Real-time Expertise (mapped from Admin subjects) */}
            <div>
              <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                <BookOpen size={16} /> Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {subjects.length > 0 ? (
                  subjects.map((tag, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider shadow-sm"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No specialization data provided.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Synchronized Footer (Matches Admin Layout) */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {staff.department} Department
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
