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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#030508] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30 transition-colors duration-300">
      <Navbar />

      {/* Fix for native dropdowns to prevent white glow/grey bg */}
      <style>{`
        .dark select option {
          background-color: #0d1117 !important;
          color: white !important;
        }
        select:focus {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* --- BACKGROUND GLOW --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto pt-32 px-6 pb-20">
        {/* --- HEADER & TOOLBAR --- */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6 group">
            <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-600/10 dark:bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
              <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              {/* pb-1 and leading-tight prevents glow clipping */}
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight pb-1">
                Faculty{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-600">
                  Hub
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-500" /> Shaping the
                Digital Frontier
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-[#0d1117]/80 backdrop-blur-md rounded-2xl outline-none border border-slate-200 dark:border-white/5 focus:border-indigo-500/50 transition-all text-sm"
              />
            </div>

            <div className="relative sm:w-64 group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-white/5 focus:border-indigo-500/50 outline-none text-sm font-black appearance-none cursor-pointer transition-all"
              >
                <option value="" className="bg-white dark:bg-[#0d1117]">
                  All Departments
                </option>
                {["CSE", "ECE", "EEE", "MECH", "CIVIL"].map((d) => (
                  <option
                    key={d}
                    value={d}
                    className="bg-white dark:bg-[#0d1117]"
                  >
                    {d}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* --- GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 bg-slate-200 dark:bg-white/5 rounded-[3rem] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

const StaffCard = ({ s, onClick }) => (
  <div
    onClick={onClick}
    className="group relative bg-white dark:bg-[#0d1117]/60 backdrop-blur-xl rounded-[3rem] border border-slate-200 dark:border-white/10 p-8 transition-all duration-500 hover:-translate-y-3 hover:bg-slate-100 dark:hover:bg-[#12161f] hover:border-indigo-500/50 cursor-pointer shadow-xl overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-32 h-32 mb-6 relative">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-all" />
        {s.photo ? (
          <img
            src={s.photo}
            className="w-full h-full object-cover rounded-[2.5rem] border-2 border-white/10 group-hover:border-indigo-400/50 shadow-2xl transition-all duration-500"
            alt={s.name}
          />
        ) : (
          <div className="w-full h-full bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white">
            {s.name[0]}
          </div>
        )}
      </div>

      <h3 className="text-xl font-black mb-1 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {s.name}
      </h3>
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-6">
        {getPosition(s)}
      </p>

      <div className="w-full py-3 px-5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 flex justify-between items-center group-hover:bg-indigo-500/10 transition-all duration-300">
        <div className="text-left">
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">
            Department
          </p>
          <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase">
            {s.department}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center transition-all duration-500">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  </div>
);

const StaffDetailPanel = ({ staff, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white dark:bg-[#080a0f] h-auto max-h-[90vh] md:h-[550px] rounded-[3.5rem] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* LEFT SIDE IDENTITY */}
        <div className="w-full md:w-[40%] bg-slate-50 dark:bg-[#0d111b] p-12 flex flex-col items-center justify-center text-center border-r border-slate-200 dark:border-white/5 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

          <div className="relative z-10 w-full">
            <div className="w-48 h-48 mx-auto rounded-[3rem] overflow-hidden border-[6px] border-indigo-500/20 shadow-2xl mb-8 transform -rotate-2">
              {staff.photo ? (
                <img
                  src={staff.photo}
                  className="w-full h-full object-cover"
                  alt={staff.name}
                />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-7xl font-black text-white">
                  {staff.name[0]}
                </div>
              )}
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-2 pb-1">
              {staff.name}
            </h2>
            <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs mb-8">
              {getPosition(staff)}
            </p>

            <div className="grid grid-cols-1 gap-3 w-full px-4">
              <div className="flex items-center gap-4 bg-white dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
                <Building2 size={20} className="text-indigo-500" />
                <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
                  {staff.department} DEPT
                </span>
              </div>
              <div className="flex items-center gap-4 bg-white dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
                <Clock size={20} className="text-cyan-500 dark:text-cyan-400" />
                <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
                  {staff.experience || 0} YRS EXP.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="flex-1 p-12 relative flex flex-col justify-center bg-white dark:bg-[#080a0f] overflow-y-auto custom-scrollbar">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-all z-50"
          >
            <X size={24} />
          </button>

          <div className="space-y-8">
            <section>
              <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <GraduationCap size={18} /> Credentials
              </h4>
              <div className="bg-slate-100/50 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-slate-200 dark:border-white/5">
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {staff.qualification || "Qualification details not listed."}
                </p>
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em] mb-5 flex items-center gap-2">
                <BookOpen size={18} /> Expertise Areas
              </h4>
              <div className="flex flex-wrap gap-3">
                {[
                  "Research & Analysis",
                  "Student Mentorship",
                  "Technical Innovation",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-200 text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                <Sparkles size={18} /> Profile Bio
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed italic line-clamp-3">
                "{staff.name} is a key member of the academic community,
                contributing extensively to the development of the{" "}
                {staff.department} unit."
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
