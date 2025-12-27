import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import {
  Users,
  Building2,
  Calendar,
  Briefcase,
  Sparkles,
  Zap,
  ArrowRight,
  Star,
  Target,
  Rocket,
  ShieldCheck,
  Globe,
  Award,
  BookOpen,
  MessageSquare,
  Microscope,
} from "lucide-react";

/* ================= SMOOTH COUNTER HOOK ================= */
const useSmoothCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  useEffect(() => {
    let startTime = null;
    let animationFrameId;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - percentage, 4);
      const currentCount = Math.floor(ease * end);
      if (countRef.current !== currentCount) {
        setCount(currentCount);
        countRef.current = currentCount;
      }
      if (progress < duration)
        animationFrameId = requestAnimationFrame(animate);
      else setCount(end);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);
  return count;
};

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const galleryRef = useRef(null);

  const [liveData, setLiveData] = useState({
    studentCount: 0,
    facultyCount: 0,
    eventCount: 0,
    jobCount: 0,
    latestJob: null,
    nextEvent: null,
  });

  // ✅ Intersection Observer for Staggered Fade-Up
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsGalleryVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statsRes, eventsRes, jobsRes, meRes] = await Promise.all([
          API.get("/info/stats").catch(() => ({
            data: { students: 1200, staff: 85 },
          })),
          API.get("/info/events").catch(() => ({ data: [] })),
          API.get("/info/jobs").catch(() => ({ data: [] })),
          API.get("/users/me").catch(() => ({ data: null })),
        ]);

        setLiveData({
          studentCount: statsRes.data.students || 0,
          facultyCount: statsRes.data.staff || 0,
          eventCount: eventsRes.data.length || 0,
          jobCount: jobsRes.data.length || 0,
          latestJob: jobsRes.data[0] || null,
          nextEvent: eventsRes.data[0] || null,
        });
        setUser(meRes.data);
      } catch (err) {
        console.error("Sync Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const students = useSmoothCounter(liveData.studentCount, 2500);
  const faculty = useSmoothCounter(liveData.facultyCount, 2000);
  const events = useSmoothCounter(liveData.eventCount, 2000);
  const jobs = useSmoothCounter(liveData.jobCount, 2000);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#05070a] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 transition-colors duration-500 pb-20 overflow-x-hidden">
      <Navbar />

      {/* --- PREMIUM AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[700px] h-[700px] bg-rose-600/10 dark:bg-rose-600/10 rounded-full blur-[140px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-32 space-y-20">
        {/* ================= HERO SECTION (OPTIMIZED MEDIUM SCALE) ================= */}
        <section className="relative rounded-[2.5rem] p-[2px] overflow-hidden transition-all duration-700 shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x" />
          <div className="absolute inset-0 bg-white/90 dark:bg-[#0d1117]/95 backdrop-blur-2xl" />

          <div className="relative p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[500px]">
            <div className="max-w-3xl space-y-8 text-center lg:text-left relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[11px] font-black uppercase tracking-[0.3em]">
                <Zap size={14} className="fill-current animate-bounce" />
                Live Status • 2025
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Welcome, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm">
                  {user?.name || "Explorer"}
                </span>{" "}
                <br />
                <span className="text-3xl md:text-5xl opacity-90 inline-flex items-center gap-3">
                  to BVC Digital Hub{" "}
                  <Sparkles
                    className="text-amber-400 animate-pulse"
                    size={40}
                  />
                </span>
              </h1>

              <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                A high-performance gateway to your academic career. Track live
                data, engage with faculty, and accelerate your placement
                journey.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                <button
                  onClick={() => navigate("/projects")}
                  className="group/btn px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-4"
                >
                  Open Workspace
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 group-hover/btn:translate-x-2"
                  />
                </button>
                <button
                  onClick={() => navigate("/staff")}
                  className="px-10 py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl font-black text-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-lg"
                >
                  View Faculty
                </button>
              </div>
            </div>

            <div className="hidden lg:block relative shrink-0 scale-110">
              <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-600 to-pink-600 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
              <div className="relative p-3 rounded-[4rem] bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500&auto=format&fit=crop"
                  className="w-64 h-64 rounded-[3.5rem] object-cover"
                  alt="BVC Digital"
                />
                <div className="absolute -bottom-4 -left-4 px-5 py-2 bg-indigo-600 rounded-xl shadow-xl border border-white/20">
                  <span className="text-white font-black text-[10px] uppercase tracking-widest">
                    Digital Hub
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <CompactStat
            title="Students"
            value={students}
            suffix="+"
            icon={Users}
            color="from-blue-500 to-cyan-500"
            onClick={() => navigate("/home")}
          />
          <CompactStat
            title="Faculty"
            value={faculty}
            suffix="+"
            icon={Building2}
            color="from-purple-500 to-indigo-500"
            onClick={() => navigate("/staff")}
          />
          <CompactStat
            title="Live Events"
            value={events}
            suffix="+"
            icon={Calendar}
            color="from-emerald-500 to-teal-500"
            onClick={() => navigate("/events")}
          />
          <CompactStat
            title="Careers"
            value={jobs}
            suffix="+"
            icon={Briefcase}
            color="from-orange-500 to-rose-500"
            onClick={() => navigate("/jobs")}
          />
        </section>

        {/* ================= CONTENT GRIDS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black flex items-center gap-3">
                <MessageSquare size={28} className="text-indigo-500" />{" "}
                Community News
              </h2>
              <div className="h-1 flex-1 mx-4 bg-slate-200 dark:bg-white/10 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoCard
                title="Featured Event"
                label={liveData.nextEvent?.title || "Workshops Incoming"}
                desc="Gain hands-on experience in modern AI architectures and cloud computing."
                icon={Star}
                gradient="from-purple-600 to-pink-600"
                onClick={() =>
                  liveData.nextEvent
                    ? navigate(`/events/${liveData.nextEvent._id}`)
                    : navigate("/events")
                }
              />
              <InfoCard
                title="Top Placement"
                label={liveData.latestJob?.title || "Hiring Now"}
                desc={`Apply for roles at ${
                  liveData.latestJob?.company || "Global Leaders"
                } today.`}
                icon={Rocket}
                gradient="from-blue-600 to-indigo-600"
                onClick={() => navigate("/jobs")}
              />
            </div>
          </div>

          <div className="rounded-[3rem] bg-white/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-10 shadow-2xl flex flex-col justify-center">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-rose-500">
              <Target size={28} /> Core Values
            </h2>
            <ul className="space-y-8">
              <li className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <Microscope size={24} />
                </div>
                <div>
                  <p className="font-black text-lg">Research</p>
                  <p className="text-sm opacity-60 font-medium">
                    15+ Advanced Labs
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-black text-lg">Excellence</p>
                  <p className="text-sm opacity-60 font-medium">
                    Global Certification
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="font-black text-lg">Network</p>
                  <p className="text-sm opacity-60 font-medium">
                    Industry Partners
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* ================= MODERN AESTHETIC GALLERY (GLOWING & GLOSSY) ================= */}
        <section ref={galleryRef} className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black tracking-tighter">
              Campus Highlights
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Glimpses of BVC excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "/INDUCTION-1.jpg",
              "/Banner.jpg",
              "/Banner-6-2.png",
              "/Banner-6-1.png",
              "/Banner-5.png",
              "/Banner-4_compressed.jpg",
            ].map((src, i) => (
              <div
                key={i}
                onClick={() => setSelectedImg(src)}
                className={`relative overflow-hidden rounded-[2.5rem] shadow-xl group h-[350px] border cursor-zoom-in transition-all duration-1000 transform
                  ${
                    isGalleryVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-20"
                  }
                  ${selectedImg === src ? "scale-95" : "scale-100"}
                  bg-white dark:bg-[#111827]/50 backdrop-blur-md border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img
                  src={src}
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  alt={`Highlight ${i + 1}`}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800";
                  }}
                />

                {/* Glassmorphic Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white font-black text-lg flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-400" /> Academic
                      Excellence
                    </p>
                    <p className="text-white/70 text-xs font-medium mt-1">
                      BVC Engineering College • Odalarevu
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FULL IMAGE LIGHTBOX MODAL ================= */}
        {selectedImg && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-indigo-950/90 backdrop-blur-2xl transition-all duration-500 animate-in fade-in"
            onClick={() => setSelectedImg(null)}
          >
            <button
              className="absolute top-8 right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 z-[110] active:scale-90"
              onClick={() => setSelectedImg(null)}
            >
              <Zap className="rotate-45" size={28} />
            </button>

            <div className="relative max-w-5xl w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
              <img
                src={selectedImg}
                className="max-w-full max-h-full rounded-[2.5rem] shadow-[0_0_80px_rgba(99,102,241,0.4)] border-4 border-white/10 object-contain"
                alt="Selected Highlights"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* ================= REFINED COMPONENTS ================= */

const CompactStat = ({ title, value, suffix, color, icon: Icon, onClick }) => (
  <div
    onClick={onClick}
    className="relative group bg-white/70 dark:bg-[#161b22]/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-xl transition-all hover:-translate-y-2 cursor-pointer text-center md:text-left"
  >
    <div
      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color} rounded-t-full`}
    />
    <div
      className={`mx-auto md:mx-0 mb-6 p-4 rounded-2xl bg-gradient-to-br ${color} text-white w-fit shadow-2xl group-hover:rotate-6 transition-transform`}
    >
      <Icon size={24} />
    </div>
    <p className="text-slate-500 dark:text-slate-400 font-black uppercase text-xs tracking-widest mb-1">
      {title}
    </p>
    <h3 className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
      {value.toLocaleString()}
      <span className="text-2xl ml-1 opacity-40">{suffix}</span>
    </h3>
  </div>
);

const InfoCard = ({ title, label, desc, icon: Icon, gradient, onClick }) => (
  <div className="relative group overflow-hidden rounded-[3rem] bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-10 flex flex-col shadow-2xl">
    <div className="relative z-10 space-y-5">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-xl`}
      >
        <Icon size={28} />
      </div>
      <p className="text-indigo-500 font-black uppercase text-xs tracking-widest">
        {title}
      </p>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white line-clamp-1 leading-tight">
        {label}
      </h3>
      <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
    <div
      onClick={onClick}
      className="mt-8 flex items-center gap-3 font-black text-sm hover:text-indigo-500 cursor-pointer transition-colors group/btn"
    >
      View Details{" "}
      <ArrowRight
        size={18}
        className="group-hover/btn:translate-x-2 transition-transform"
      />
    </div>
  </div>
);

export default Home;
