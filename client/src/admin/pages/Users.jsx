import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminAPI from "../../services/adminApi"; // Keeping your original API service
import AdminNavbar from "../components/AdminNavbar";
import {
  Users as UsersIcon,
  Search,
  Filter,
  Mail,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminAPI
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => console.error("Failed to load users"));
  }, []);

  const filtered = users.filter((u) => {
    return (
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (department === "" || u.department === department)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-rose-500/30 transition-colors duration-300">
      <AdminNavbar />

      {/* Background Decorative Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-4">
              <span className="group p-2.5 rounded-xl border-2 border-fuchsia-500/20 bg-fuchsia-50 dark:bg-fuchsia-900/10 text-fuchsia-600 dark:text-fuchsia-300 shadow-[0_0_15px_rgba(232,121,249,0.3)]">
                <UsersIcon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300 ease-out" />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-pink-600 to-orange-500 dark:from-fuchsia-400 dark:via-pink-400 dark:to-orange-400">
                User Directory
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Manage student accounts and permissions.
            </p>
          </div>
          <div className="px-5 py-2 bg-white dark:bg-[#161b22] rounded-full border border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm backdrop-blur-md">
            Total Users:{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {users.length}
            </span>
          </div>
        </div>

        {/* Filters & Search */}
        <div
          className="sticky top-24 z-20 mb-10 p-2 rounded-2xl bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-blue-500/5 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-[#0d1117] focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>

            {/* Department Filter */}
            <div className="relative md:w-64 group">
              <Filter className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-xl bg-transparent text-slate-900 dark:text-white appearance-none cursor-pointer focus:bg-white dark:focus:bg-[#0d1117] focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              >
                <option value="" className="dark:bg-[#161b22]">
                  All Departments
                </option>
                <option value="CSE" className="dark:bg-[#161b22]">
                  CSE
                </option>
                <option value="ECE" className="dark:bg-[#161b22]">
                  ECE
                </option>
                <option value="EEE" className="dark:bg-[#161b22]">
                  EEE
                </option>
                <option value="MECH" className="dark:bg-[#161b22]">
                  MECH
                </option>
                <option value="CIVIL" className="dark:bg-[#161b22]">
                  CIVIL
                </option>
              </select>
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

        {/* User Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          {filtered.length > 0 ? (
            filtered.map((u) => (
              <div
                key={u._id}
                onClick={() => navigate(`/admin/users/${u._id}`)}
                className="group relative bg-white dark:bg-[#161b22] p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                {/* Decorative Top Gradient Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-start gap-4">
                  {/* Profile Pic */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {u.profilePic ? (
                        <img
                          src={u.profilePic}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-black text-2xl">
                          {u.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {/* Status Dot (Optional) */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#161b22]"></div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {u.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-2 truncate">
                      <Mail className="w-3.5 h-3.5" />
                      {u.email}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {/* Department Badge */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <ShieldCheck className="w-3 h-3" />
                        {u.department || "N/A"}
                      </div>
                      {/* Year Badge (Assuming logic, or just a placeholder if not in data) */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <GraduationCap className="w-3 h-3" />
                        Student
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Details Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white/50 dark:bg-[#161b22]/50 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No users found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
