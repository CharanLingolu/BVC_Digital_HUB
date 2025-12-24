import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowUpRight,
  Building2,
  Sparkles,
  Search,
} from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/info/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Failed to load jobs", err))
      .finally(() => setLoading(false));
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      [job.title, job.company, job.location, job.type]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-cyan-500/30 transition-colors duration-300 relative overflow-x-hidden">
      <Navbar />

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-widest mb-4 border border-cyan-200 dark:border-cyan-700/50">
            <Briefcase size={14} className="fill-current" /> Career Portal
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-cyan-600 to-slate-900 dark:from-white dark:via-cyan-400 dark:to-white tracking-tight mb-6">
            Find Your Next Role
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explore internships, full-time positions, and exclusive placement
            opportunities curated for you.
          </p>
        </div>

        {/* ================= SEARCH BAR (SAME AS EVENTS) ================= */}
        <div className="max-w-xl mx-auto mb-14 animate-fade-in-up">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg">
              <Search className="text-slate-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by role, company, type or location..."
                className="w-full bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* ================= JOBS GRID ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

/* ================= JOB CARD ================= */
const JobCard = ({ job }) => {
  const deadlineDate = job.deadline
    ? new Date(job.deadline).toLocaleDateString()
    : "Open";

  const typeStyles = {
    "Full-time":
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200",
    "Part-time":
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200",
    Internship:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200",
    Contract:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200",
  };

  return (
    <div className="group relative bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-white/5 p-8 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-50"></div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-white/5 dark:to-white/10 flex items-center justify-center border shadow-sm">
            <Building2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold">{job.company}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Posted Recently
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            typeStyles[job.type] || typeStyles["Full-time"]
          }`}
        >
          {job.type}
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-black mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
          {job.title}
        </h2>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
          <DollarSign size={16} className="text-green-500" />
          {job.salary || "Not Disclosed"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
          <MapPin size={14} className="text-cyan-500" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-white/5 p-3 rounded-xl">
          <Clock size={14} className="text-orange-500" />
          <span className="truncate">Due: {deadlineDate}</span>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6">
          {job.description}
        </p>

        {job.link ? (
          <a
            href={job.link}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-cyan-600 dark:hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98]"
          >
            Apply Now <ArrowUpRight size={18} />
          </a>
        ) : (
          <button
            disabled
            className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 font-bold cursor-not-allowed"
          >
            Application Closed
          </button>
        )}
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
    <h3 className="text-2xl font-bold mb-2">No Openings Found</h3>
    <p className="text-slate-500 dark:text-slate-400">
      Try searching with different keywords.
    </p>
  </div>
);

export default Jobs;
