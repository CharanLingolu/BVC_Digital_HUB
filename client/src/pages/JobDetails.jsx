import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowLeft,
  Building2,
  Sparkles,
  Zap,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const NAVBAR_HEIGHT = 70;

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/info/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => toast.error("Failed to load job details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#030407]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <div className="absolute w-8 h-8 border-4 border-blue-500/20 border-b-blue-500 rounded-full animate-spin-slow" />
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#030407] text-slate-900 dark:text-white relative transition-all duration-700 flex flex-col">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-600/25 blur-[100px] md:blur-[160px] animate-pulse rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-blue-600/15 blur-[120px] md:blur-[200px] rounded-full" />
      </div>

      <main
        className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col flex-1 pb-10"
        style={{ paddingTop: NAVBAR_HEIGHT + 20 }}
      >
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8 shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 text-xs font-black uppercase tracking-widest hover:bg-cyan-600 hover:text-white transition-all shadow-lg active:scale-95"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Jobs
          </button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10">
          {/* LEFT: COMPANY INFO CARD */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-white/60 dark:bg-white/[0.03] backdrop-blur-3xl border border-white/40 dark:border-white/10 p-8 shadow-2xl flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-xl mb-6">
                <div className="w-full h-full rounded-[1.4rem] bg-white dark:bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                  <Building2 size={40} className="text-cyan-500" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                {job.company}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold flex items-center gap-2 mb-6">
                <ShieldCheck size={16} className="text-cyan-500" /> Verified
                Employer
              </p>

              <div className="w-full space-y-3">
                <GlossyStat
                  icon={MapPin}
                  label="Location"
                  value={job.location}
                  color="from-cyan-600 to-blue-500"
                />
                <GlossyStat
                  icon={DollarSign}
                  label="Package"
                  value={job.salary || "Best in Industry"}
                  color="from-emerald-600 to-teal-500"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: JOB DETAILS */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative rounded-[2.5rem] bg-white/40 dark:bg-white/[0.02] backdrop-blur-3xl border border-white/40 dark:border-white/10 p-8 lg:p-10 flex flex-col shadow-2xl overflow-hidden h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 w-fit">
                    <Zap size={14} className="text-cyan-500 fill-cyan-500" />
                    <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest">
                      {job.type}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mt-4 leading-tight uppercase tracking-tighter">
                    {job.title}
                  </h1>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Deadline
                  </p>
                  <p className="text-sm font-bold text-orange-500 uppercase">
                    {new Date(job.deadline).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-8 flex-1">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-500 mb-4 flex items-center gap-2">
                    <Sparkles size={16} /> Job Description
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-medium opacity-90 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10">
                    <CheckCircle2
                      size={24}
                      className="text-emerald-500 shrink-0 mt-1"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        Key Responsibility
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Join our dynamic team and drive innovation in
                        high-impact projects.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10">
                    <CheckCircle2
                      size={24}
                      className="text-emerald-500 shrink-0 mt-1"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        Growth & Learning
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Opportunity to work with the latest tech stack and
                        industry mentors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-10 mt-10 border-t border-slate-900/10 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => navigate(`/jobs/${job._id}/apply`)}
                  className="w-full sm:flex-1 group relative overflow-hidden py-5 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-black text-lg tracking-[0.1em] uppercase shadow-[0_20px_40px_-10px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-500"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Start Application
                    <ExternalLink className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const GlossyStat = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-4 w-full p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-sm">
    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
      <Icon size={18} className="text-white" />
    </div>
    <div className="text-left overflow-hidden">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
        {label}
      </p>
      <p className="text-[13px] font-bold text-slate-800 dark:text-white truncate">
        {value}
      </p>
    </div>
  </div>
);

export default JobDetails;
