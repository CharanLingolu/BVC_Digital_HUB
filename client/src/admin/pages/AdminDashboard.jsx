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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  // Fetch Real Data & Generate Activity Feed
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch all data in parallel
        const [usersRes, staffRes, eventsRes, jobsRes] = await Promise.all([
          axios
            .get("http://localhost:5000/api/admin/users", config)
            .catch(() => ({ data: [] })),
          axios
            .get("http://localhost:5000/api/admin/staff", config)
            .catch(() => ({ data: [] })),
          axios
            .get("http://localhost:5000/api/admin/events", config)
            .catch(() => ({ data: [] })),
          axios
            .get("http://localhost:5000/api/admin/jobs", config)
            .catch(() => ({ data: [] })),
        ]);

        const usersData = usersRes.data || [];
        const staffData = staffRes.data || [];
        const eventsData = eventsRes.data || [];
        const jobsData = jobsRes.data || [];

        // 1. Set Counts
        setStats({
          users: usersData.length,
          staff: staffData.length,
          events: eventsData.length,
          jobs: jobsData.length,
        });

        // 2. Generate Dynamic Activity Feed
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

        // Sort by newest first
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

      {/* CSS for custom sleek scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Background Decorative Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-200 dark:border-rose-800 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Live Overview
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
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

        {/* Stats Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {statCards.map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              loading={loading}
              onClick={() => navigate(stat.link)}
            />
          ))}
        </div>

        {/* Content Section: Split View */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          {/* Main Activity Area - FIXED HEIGHT & SCROLL */}
          <div className="lg:col-span-2 space-y-8">
            {/* Reduced height from 500px to 420px for better density */}
            <div className="bg-white/70 dark:bg-[#161b22]/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-xl border border-white/50 dark:border-white/5 relative overflow-hidden group h-[420px] flex flex-col">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <Clock size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Real-time Activity
                  </h2>
                </div>
              </div>

              {/* Dynamic Activity List - SCROLLABLE with Custom Scrollbar */}
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {loading ? (
                  // Skeleton Loader
                  [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-white/20 dark:border-white/5"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <ActivityItem key={i} item={item} />
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent activity found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions / Side Panel - FIXED HEIGHT */}
          <div className="space-y-6">
            {/* Reduced height from 500px to 420px to match Activity box */}
            <div className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20 group h-[420px]">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700"></div>
              {/* Abstract shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10 text-white flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 shadow-inner border border-white/20">
                    <Sparkles size={24} className="text-indigo-100" />
                  </div>
                  <h2 className="text-2xl font-black mb-2">Admin Pro Tip</h2>
                  <p className="text-indigo-100 text-sm leading-relaxed font-medium opacity-90">
                    Keep your events and job postings up to date to ensure high
                    student engagement. Updated listings get 40% more views!
                  </p>
                </div>

                {/* Button pushed to bottom */}
                <button
                  onClick={() => navigate("/admin/jobs")}
                  className="w-full bg-white text-indigo-600 py-3.5 rounded-xl text-sm font-black hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2 mt-4"
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

// --- HELPER COMPONENT: Activity Item ---
const ActivityItem = ({ item }) => {
  let icon = <Activity size={18} />;
  let title = "System Update";
  let subtitle = "Just now";
  let colorClass =
    "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-500";
  let hoverText = "group-hover/item:text-slate-600";
  let bgHover = "group-hover/item:bg-slate-100";

  // Format Date
  const dateObj = new Date(item.date);
  const dateStr =
    dateObj.toLocaleDateString() +
    " " +
    dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  switch (item.type) {
    case "user":
      icon = <UserPlus size={18} />;
      title = `New Student: ${item.data.name}`;
      subtitle = `Registered on ${dateStr}`;
      colorClass =
        "from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-600 dark:text-blue-400";
      hoverText =
        "group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400";
      bgHover =
        "group-hover/item:bg-blue-50 dark:group-hover/item:bg-blue-900/20";
      break;
    case "event":
      icon = <Megaphone size={18} />;
      title = `New Event: ${item.data.title}`;
      subtitle = `Scheduled • ${dateStr}`;
      colorClass =
        "from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-600 dark:text-emerald-400";
      hoverText =
        "group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400";
      bgHover =
        "group-hover/item:bg-emerald-50 dark:group-hover/item:bg-emerald-900/20";
      break;
    case "job":
      icon = <Briefcase size={18} />;
      title = `Job Posted: ${item.data.title}`;
      subtitle = `${item.data.company} • ${dateStr}`;
      colorClass =
        "from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 text-orange-600 dark:text-orange-400";
      hoverText =
        "group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400";
      bgHover =
        "group-hover/item:bg-orange-50 dark:group-hover/item:bg-orange-900/20";
      break;
    case "staff":
      icon = <Building2 size={18} />;
      title = `Faculty Added: ${item.data.name}`;
      subtitle = `${item.data.department} • ${dateStr}`;
      colorClass =
        "from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40 text-violet-600 dark:text-violet-400";
      hoverText =
        "group-hover/item:text-violet-600 dark:group-hover/item:text-violet-400";
      bgHover =
        "group-hover/item:bg-violet-50 dark:group-hover/item:bg-violet-900/20";
      break;
    default:
      break;
  }

  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-[#0d1117] transition-all cursor-default group/item">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center font-bold border border-white/50 dark:border-white/5 group-hover/item:scale-105 transition-transform`}
        >
          {icon}
        </div>
        <div>
          <p
            className={`font-bold text-sm text-slate-900 dark:text-white ${hoverText} transition-colors line-clamp-1`}
          >
            {title}
          </p>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 ${bgHover} ${hoverText} transition-all`}
      >
        <ArrowRight size={14} />
      </div>
    </div>
  );
};

// Reusable Modern Glass Card
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
      {/* Top Gradient Line */}
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

      {/* Background Icon Watermark */}
      <Icon className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-200/50 dark:text-white/5 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
    </div>
  );
};

export default AdminDashboard;
