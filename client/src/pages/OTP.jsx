import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX 1: Extract all data passed from Signup (Name, Email, Password)
  // We need these to create the user account in the final step.
  const { name, email, password } = location.state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ FIX 2: Call '/signup' instead of '/verify-otp'
      // This verifies the OTP AND creates the user AND returns the token.
      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
        otp,
      });

      toast.success(res.data.message);

      // ✅ FIX 3: Store the token (Now it actually exists!)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        // ➡️ Go to onboarding
        navigate("/onboarding");
      } else {
        throw new Error("Token missing in response");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Error State: Missing Data (Prevents direct access without Signup step)
  if (!email || !password) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#05070a] p-6 font-sans">
        <div className="w-full max-w-md bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-red-100 dark:border-red-900/30 text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Invalid Request
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Missing account details. Please sign up again.
          </p>
          <Link
            to="/signup"
            className="block w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg"
          >
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#05070a] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/50 p-4 relative overflow-hidden transition-colors duration-500">
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* ================= GLASS CARD ================= */}
      <div className="relative z-10 w-full max-w-md bg-white/70 dark:bg-[#161b22]/60 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/10 animate-fade-in-up overflow-hidden">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60"></div>

        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6 group">
            <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 text-indigo-600 dark:text-indigo-400 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border border-white/40 dark:border-white/10 transform transition-transform group-hover:rotate-6">
              <ShieldCheck className="w-12 h-12" />
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-indigo-200 mb-3 tracking-tight">
            Verify OTP
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            Enter the 6-digit code sent to <br />
            <span className="text-slate-900 dark:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full mt-2 inline-block border border-indigo-100 dark:border-indigo-500/30">
              {email}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              className="w-full p-6 text-center text-4xl tracking-[0.5em] font-black rounded-3xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0d1117]/50 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 hover:bg-white dark:hover:bg-[#0d1117]"
              style={{ fontFamily: "monospace" }}
            />
            {/* Glow effect behind input */}
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="relative w-full py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-2 overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Didn't receive the code?{" "}
            <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors inline-flex items-center gap-1 hover:underline underline-offset-4 ml-1">
              <RefreshCw className="w-3 h-3" /> Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTP;
