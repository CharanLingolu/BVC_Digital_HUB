import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  /* ================= 🔐 USER (LOGIC UNCHANGED) ================= */
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

  /* ================= 🔄 SYNC USER STATE ================= */
  useEffect(() => {
    const syncUser = () => setCurrentUserId(getCurrentUserId());

    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  /* ================= 📡 FETCH PROJECTS ================= */
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

  /* ================= 🔍 FILTER ================= */
  const filteredProjects = projects.filter((project) => {
    const text = search.toLowerCase();
    const uName = project.user?.name?.toLowerCase() || "";
    const uDept = project.user?.department || project.user?.dept || "";

    return (
      (project.title.toLowerCase().includes(text) || uName.includes(text)) &&
      (department === "" || uDept === department)
    );
  });

  /* ================= 🖥️ MODERN UI ================= */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* Background Decorative Grids (Matches Home Page) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="h-24" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Student{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
                Projects
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Explore innovation across campus. Discover what your peers are
              building.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="px-4 py-2 bg-white/50 dark:bg-[#161b22]/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500">
              {projects.length} Total Projects
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="sticky top-24 z-30 mb-10 p-2 rounded-2xl bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-indigo-500/5">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search titles, students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-transparent
                           text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                           focus:bg-white dark:focus:bg-[#0d1117]
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {/* Department Select */}
            <div className="relative w-full md:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-transparent appearance-none
                           text-slate-900 dark:text-white cursor-pointer
                           focus:bg-white dark:focus:bg-[#0d1117]
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              >
                <option value="" className="bg-white dark:bg-[#161b22]">
                  All Departments
                </option>
                <option value="CSE" className="bg-white dark:bg-[#161b22]">
                  CSE
                </option>
                <option value="ECE" className="bg-white dark:bg-[#161b22]">
                  ECE
                </option>
                <option value="EEE" className="bg-white dark:bg-[#161b22]">
                  EEE
                </option>
                <option value="MECH" className="bg-white dark:bg-[#161b22]">
                  MECH
                </option>
                <option value="CIVIL" className="bg-white dark:bg-[#161b22]">
                  CIVIL
                </option>
              </select>
              {/* Custom Chevron */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          /* Modern Skeleton Loader */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-white/50 dark:bg-[#161b22]/50 border border-slate-200 dark:border-slate-800 animate-pulse"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-t-2xl w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Modern Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <svg
                className="h-10 w-10 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              We couldn't find anything matching "{search}" in{" "}
              {department || "all departments"}. Try adjusting your filters.
            </p>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="transform hover:scale-[1.02] transition-transform duration-300"
              >
                <ProjectCard project={project} currentUserId={currentUserId} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
