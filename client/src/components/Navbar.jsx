import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  FolderKanban,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully 👋", { autoClose: 1500 });
    setTimeout(() => navigate("/"), 1500);
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full
      text-sm font-medium text-slate-600 dark:text-slate-300
      transition-all duration-300
      hover:bg-indigo-50 dark:hover:bg-white/5
      hover:text-indigo-600 dark:hover:text-indigo-400"
    >
      <Icon
        size={18}
        className="text-slate-400 group-hover:text-indigo-500
        group-hover:scale-110 group-hover:-rotate-12 transition-all"
      />
      {children}
    </Link>
  );

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[60]">
        <div className="absolute inset-0 bg-white/70 dark:bg-[#05070a]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm" />

        <div className="relative max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="group relative w-12 h-12 flex items-center justify-center cursor-pointer transition-transform duration-500">
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl rotate-3 shadow-lg 
                  transition-all duration-700 ease-in-out 
                  group-hover:rotate-[360deg] group-hover:scale-110 group-hover:shadow-indigo-500/50"
              />

              <span className="relative z-10 text-white font-black text-lg transition-transform duration-500 group-hover:scale-110">
                BVC
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              Digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Hub
              </span>
            </span>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-4">
            {!token ? (
              <>
                {/* Log In */}
                <Link
                  to="/login"
                  className="relative text-sm font-bold text-slate-600 dark:text-slate-300
                  transition-all duration-300
                  hover:text-indigo-600 dark:hover:text-indigo-400
                  after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0
                  after:bg-indigo-500 after:rounded-full
                  after:transition-all after:duration-300
                  hover:after:w-full"
                >
                  Log In
                </Link>

                {/* Sign Up */}
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-xl
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  text-white font-bold text-sm
                  shadow-lg shadow-blue-500/25
                  transition-all duration-300
                  hover:shadow-indigo-500/50
                  hover:-translate-y-0.5
                  active:scale-95"
                >
                  Sign Up
                </Link>

                {/* Admin */}
                <Link
                  to="/admin/login"
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl
                  border border-slate-200 dark:border-white/10
                  text-slate-600 dark:text-slate-400
                  font-bold text-sm
                  transition-all duration-300
                  hover:border-indigo-400/60
                  hover:text-indigo-600 dark:hover:text-indigo-400
                  hover:bg-indigo-50/50 dark:hover:bg-white/5
                  hover:shadow-md
                  hover:-translate-y-0.5"
                >
                  <ShieldCheck
                    size={16}
                    className="transition-all duration-300
                    group-hover:text-indigo-500
                    group-hover:scale-110"
                  />
                  Admin
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                <NavLink to="/home" icon={LayoutDashboard}>
                  Home
                </NavLink>
                <NavLink to="/projects" icon={FolderKanban}>
                  Projects
                </NavLink>
                <NavLink to="/staff" icon={Users}>
                  Faculty
                </NavLink>
                <NavLink to="/events" icon={Calendar}>
                  Events
                </NavLink>
                <NavLink to="/jobs" icon={Briefcase}>
                  Jobs
                </NavLink>

                <Link
                  to="/profile"
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <User size={20} />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-center"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-md md:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* MOBILE DRAWER – ADMIN STYLE */}
      <div
        className={`fixed inset-x-4 top-[5.5rem] z-[70] md:hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white dark:border-white/10 p-6">
          {!token ? (
            <div className="space-y-4">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-white/5 font-black"
              >
                Log In <ChevronRight size={18} />
              </Link>

              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center p-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-lg"
              >
                Sign Up Now
              </Link>

              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 font-bold"
              >
                <ShieldCheck size={20} /> Admin Access
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    to: "/home",
                    label: "Home",
                    icon: LayoutDashboard,
                    color: "text-blue-500 bg-blue-500/10",
                  },
                  {
                    to: "/projects",
                    label: "Projects",
                    icon: FolderKanban,
                    color: "text-indigo-500 bg-indigo-500/10",
                  },
                  {
                    to: "/staff",
                    label: "Faculty",
                    icon: Users,
                    color: "text-purple-500 bg-purple-500/10",
                  },
                  {
                    to: "/events",
                    label: "Events",
                    icon: Calendar,
                    color: "text-orange-500 bg-orange-500/10",
                  },
                  {
                    to: "/jobs",
                    label: "Jobs",
                    icon: Briefcase,
                    color: "text-emerald-500 bg-emerald-500/10",
                  },
                  {
                    to: "/profile",
                    label: "Profile",
                    icon: User,
                    color: "text-rose-500 bg-rose-500/10",
                  },
                ].map(({ to, label, icon: Icon, color }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className="flex flex-col gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-lg"
                  >
                    <div className={`p-2.5 rounded-2xl ${color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      {label}
                    </span>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-3xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-black border border-red-100 dark:border-red-500/10"
              >
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
