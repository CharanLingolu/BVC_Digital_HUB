import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { Search, Filter, Rocket, Layers, Sparkles } from "lucide-react";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  /* ================= 🔐 USER LOGIC (STRICTLY PRESERVED) ================= */
  const getCurrentUserId = () => {
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("userInfo") ||
        localStorage.getItem("authUser");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.user?._id) return parsed.user._id.toString();
      if (parsed?._id) return parsed._id.toString();
      return null;
    } catch {
      return null;
    }
  };

  const [currentUserId, setCurrentUserId] = useState(getCurrentUserId());

  useEffect(() => {
    const syncUser = () => setCurrentUserId(getCurrentUserId());
    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  /* ================= 📡 FETCH DATA ================= */
  useEffect(() => {
    API.get("/projects")
      .then((res) => {
        const clean = res.data.map((p) => ({
          ...p,
          likes: Array.isArray(p.likes) ? p.likes : [],
        }));
        setProjects(clean);
      })
      .catch((err) => console.error("Failed to load projects", err))
      .finally(() => setLoading(false));
  }, []);

  /* ================= 🔍 FILTERING ================= */
  const filteredProjects = projects.filter((project) => {
    const text = search.toLowerCase();
    const uName = project.user?.name?.toLowerCase() || "";
    const uDept = project.user?.department || project.user?.dept || "";
    return (
      (project.title.toLowerCase().includes(text) || uName.includes(text)) &&
      (department === "" || uDept === department)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030407] text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* --- GLOSSY BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/10 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="h-28" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        {/* --- HERO SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase">
              <Sparkles size={14} /> Showcase Portal
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              Building the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-gradient-x">
                Future Today.
              </span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed">
              A curated gallery of engineering excellence. Browse, filter, and
              connect with the minds behind campus innovation.
            </p>
          </div>

          {/* Stats Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center gap-6 px-8 py-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-slate-800 rounded-3xl shadow-xl">
              <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500">
                <Rocket size={32} />
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                  {projects.length}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
                  Live Projects
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- STICKY FILTER BAR --- */}
        <div className="sticky top-24 z-40 mb-12">
          <div className="p-2 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border border-white/40 dark:border-slate-800/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Modern Search */}
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search by project title or student name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                />
              </div>

              {/* Modern Select */}
              <div className="relative md:w-72">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
                  <Filter size={18} />
                </div>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-14 pr-10 py-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                >
                  <option value="">All Departments</option>
                  {["CSE", "ECE", "EEE", "MECH", "CIVIL"].map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">
                  <Layers size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PROJECT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[420px] rounded-[2.5rem] bg-white/20 dark:bg-slate-900/20 border border-white/20 dark:border-slate-800 animate-pulse overflow-hidden"
              >
                <div className="h-52 bg-slate-200/50 dark:bg-slate-800/50 w-full" />
                <div className="p-8 space-y-4">
                  <div className="h-8 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl w-3/4" />
                  <div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg w-full" />
                  <div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 dark:border-slate-800">
                <Search size={40} className="text-slate-400" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              No Projects Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium">
              We couldn't find matches for{" "}
              <span className="text-indigo-500">"{search}"</span>. Try a
              different keyword or department.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="group relative transition-all duration-500 hover:-translate-y-2"
              >
                {/* Visual Card Wrapper (Assuming ProjectCard uses its own glass styles) */}
                <ProjectCard project={project} currentUserId={currentUserId} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Custom Styles for Animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `,
        }}
      />
    </div>
  );
};

export default Projects;
