import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Mail,
  Lock,
  ArrowRight,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

// ✅ GET THE API URL FROM YOUR .ENV
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ REPLACED LOCALHOST WITH API_BASE_URL
      const res = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      toast.success("Admin login successful", { autoClose: 1500 });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (error) {
      // Improved error message to show what the server actually said
      const errorMsg =
        error.response?.data?.message || "Invalid admin credentials";
      toast.error(errorMsg, { autoClose: 1500 });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#05070a] text-slate-900 dark:text-white font-sans selection:bg-rose-500/30 p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-rose-500/10 dark:bg-rose-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md bg-white/70 dark:bg-[#161b22]/60 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/10 animate-fade-in-up overflow-hidden">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-rose-500 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 group/back shadow-sm border border-transparent hover:border-rose-500/20"
          title="Back to Landing"
        >
          <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
        </button>

        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-80"></div>

        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6 group">
            <div className="absolute -inset-4 bg-rose-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30 text-rose-600 dark:text-rose-400 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-white/40 dark:border-white/10 transform transition-transform group-hover:rotate-3">
              <ShieldAlert className="w-10 h-10" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-rose-200 mb-2 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Restricted Access. Authorized Personnel Only.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
            </div>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0d1117]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all hover:bg-white dark:hover:bg-[#0d1117]"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
            </div>
            <input
              type="password"
              placeholder="Secure Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0d1117]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all hover:bg-white dark:hover:bg-[#0d1117]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Access...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <LayoutDashboard className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            System Version v2.5.0 • BVC Digital Hub
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
