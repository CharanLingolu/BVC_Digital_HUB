import React, { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import {
  Users,
  Building2,
  Calendar,
  Briefcase,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  Sparkles,
  UserPlus,
  Megaphone,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ GET THE API URL FROM YOUR .ENV
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    staff: 0,
    events: 0,
    jobs: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // ✅ REPLACED LOCALHOST WITH API_BASE_URL
        const [usersRes, staffRes, eventsRes, jobsRes] = await Promise.all([
          axios
            .get(`${API_BASE_URL}/admin/users`, config)
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_BASE_URL}/admin/staff`, config)
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_BASE_URL}/admin/events`, config)
            .catch(() => ({ data: [] })),
          axios
            .get(`${API_BASE_URL}/admin/jobs`, config)
            .catch(() => ({ data: [] })),
        ]);

        const usersData = usersRes.data || [];
        const staffData = staffRes.data || [];
        const eventsData = eventsRes.data || [];
        const jobsData = jobsRes.data || [];

        setStats({
          users: usersData.length,
          staff: staffData.length,
          events: eventsData.length,
          jobs: jobsData.length,
        });

        const activities = [
          ...usersData.map((u) => ({
            type: "user",
            data: u,
            date: u.createdAt || new Date(),
          })),
          ...eventsData.map((e) => ({
            type: "event",
            data: e,
            date: e.createdAt || e.date,
          })),
          ...jobsData.map((j) => ({
            type: "job",
            data: j,
            date: j.createdAt || new Date(),
          })),
          ...staffData.map((s) => ({
            type: "staff",
            data: s,
            date: s.createdAt || new Date(),
          })),
        ];

        const sortedActivities = activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 15);

        setRecentActivity(sortedActivities);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.users,
      change: "Live Count",
      isPositive: true,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
      link: "/admin/users",
    },
    {
      title: "Faculty Members",
      value: stats.staff,
      change: "Active Staff",
      isPositive: true,
      icon: Building2,
      color: "from-violet-500 to-purple-500",
      shadow: "shadow-purple-500/20",
      link: "/admin/staff",
    },
    {
      title: "Upcoming Events",
      value: stats.events,
      change: "Scheduled",
      isPositive: true,
      icon: Calendar,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
      link: "/admin/events",
    },
    {
      title: "Open Jobs",
      value: stats.jobs,
      change: "Hiring Now",
      isPositive: true,
      icon: Briefcase,
      color: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-500/20",
      link: "/admin/jobs",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-rose-500/30 transition-colors duration-300 overflow-x-hidden">
      <AdminNavbar />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest border border-rose-200 dark:border-rose-500/20 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Live Overview
              </span>
            </div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-orange-500 to-yellow-600 drop-shadow-md decoration-clone">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Welcome back, Admin. Here's what's happening on the platform.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white/50 dark:bg-[#161b22]/50 hover:bg-white dark:hover:bg-[#161b22] text-slate-700 dark:text-slate-200 px-5 py-3 rounded-2xl text-sm font-bold border border-slate-200 dark:border-slate-800 transition-all shadow-sm backdrop-blur-md">
              <Activity size={18} />
              <span className="hidden sm:inline">System Health</span>
            </button>
            <button
              onClick={() => navigate("/admin/events")}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5"
            >
              <Plus size={18} />
              New Event
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in-up">
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              loading={loading}
              onClick={() => navigate(stat.link)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-[#11141b] backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-2xl border border-white/40 dark:border-white/5 relative overflow-hidden h-[420px] flex flex-col group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32" />

              <div className="flex items-center justify-between mb-8 shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-inner">
                    <Activity size={20} />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">
                    Real-time Activity
                  </h2>
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto pr-4 custom-scrollbar flex-1 relative z-10">
                {loading ? (
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse border border-transparent"
                    />
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <ActivityItem key={i} item={item} />
                  ))
                ) : (
                  <div className="text-center py-20 opacity-40">
                    <Sparkles size={48} className="mx-auto mb-4" />
                    <p className="font-bold uppercase tracking-widest text-xs">
                      No activity yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20 h-[420px] flex flex-col group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#4338ca]"></div>
              <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="absolute bottom-[-15%] left-[-15%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 text-white flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-xl border border-white/20">
                  <Sparkles size={28} className="text-white" />
                </div>

                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-tight">
                  Admin <br /> Pro Tip
                </h2>

                <p className="text-indigo-50/90 text-sm leading-relaxed font-bold mb-auto">
                  Keep your events and job postings up to date to ensure high
                  student engagement. Updated listings get{" "}
                  <span className="text-white font-black bg-indigo-400/30 px-1.5 py-0.5 rounded-md">
                    40% more views!
                  </span>
                </p>

                <button
                  onClick={() => navigate("/admin/jobs")}
                  className="w-full bg-white text-[#4f46e5] py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Briefcase size={16} /> Manage Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ActivityItem = ({ item }) => {
  const navigate = useNavigate();
  let icon = <Activity size={18} />;
  let title = "System Update";
  let subtitle = "Just now";
  let colorClass =
    "from-slate-500/20 to-slate-600/20 text-slate-500 border-slate-500/20 shadow-slate-500/5";
  let link = "/admin/dashboard";

  const dateObj = new Date(item.date);
  const dateStr =
    dateObj.toLocaleDateString() +
    " " +
    dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  switch (item.type) {
    case "user":
      icon = <UserPlus size={18} />;
      title = `New Student: ${item.data.name}`;
      subtitle = `Registered • ${dateStr}`;
      colorClass =
        "from-blue-500/20 to-cyan-500/20 text-blue-500 dark:text-blue-400 border-blue-500/20 shadow-blue-500/5";
      link = "/admin/users";
      break;
    case "event":
      icon = <Megaphone size={18} />;
      title = `New Event: ${item.data.title}`;
      subtitle = `Scheduled • ${dateStr}`;
      colorClass =
        "from-emerald-500/20 to-teal-500/20 text-emerald-500 dark:text-emerald-400 border-emerald-500/20 shadow-emerald-500/5";
      link = "/admin/events";
      break;
    case "job":
      icon = <Briefcase size={18} />;
      title = `Job Posted: ${item.data.title}`;
      subtitle = `${item.data.company} • ${dateStr}`;
      colorClass =
        "from-orange-500/20 to-amber-500/20 text-orange-500 dark:text-orange-400 border-orange-500/20 shadow-orange-500/5";
      link = "/admin/jobs";
      break;
    case "staff":
      icon = <Building2 size={18} />;
      title = `Faculty Added: ${item.data.name}`;
      subtitle = `${item.data.department} • ${dateStr}`;
      colorClass =
        "from-violet-500/20 to-purple-500/20 text-violet-500 dark:text-violet-400 border-violet-500/20 shadow-violet-500/5";
      link = "/admin/staff";
      break;
    default:
      break;
  }

  return (
    <div
      onClick={() => navigate(link)}
      className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.08] hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer group/item"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center border group-hover/item:scale-110 transition-transform duration-500`}
        >
          {icon}
        </div>
        <div>
          <p className="font-black text-sm text-slate-800 dark:text-white uppercase tracking-tight group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">
            {title}
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
        <ChevronRight size={16} />
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  color,
  shadow,
  loading,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/70 dark:bg-[#161b22]/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/50 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group relative overflow-hidden cursor-pointer"
    >
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color} opacity-70`}
      ></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div
          className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg ${shadow} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={20} />
        </div>
        {change && !loading && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
              isPositive
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
                : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            <TrendingUp size={12} className={!isPositive ? "rotate-180" : ""} />
            {change}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">
          {title}
        </p>
        {loading ? (
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700/50 rounded-lg animate-pulse mt-1"></div>
        ) : (
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {value.toLocaleString()}
          </h3>
        )}
      </div>
      <Icon className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-200/50 dark:text-white/5 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
    </div>
  );
};

export default AdminDashboard;
