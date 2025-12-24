import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

/* ================= SMOOTH EASE-OUT COUNTER ================= */
const useSmoothCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    let startTime = null;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      // Calculate progress (0 to 1)
      const percentage = Math.min(progress / duration, 1);

      // Easing function: Ease Out Quart (starts fast, slows down at end)
      const ease = 1 - Math.pow(1 - percentage, 4);

      const currentCount = Math.floor(ease * end);

      if (countRef.current !== currentCount) {
        setCount(currentCount);
        countRef.current = currentCount;
      }

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it lands exactly on the number
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return count;
};

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  // Duration controls how long the animation takes (in ms)
  const projects = useSmoothCounter(520, 2500);
  const students = useSmoothCounter(2100, 2500);
  const faculty = useSmoothCounter(160, 2000);
  const placements = useSmoothCounter(95, 2000);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* Background Decorative Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="h-20" />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* ================= HERO SECTION ================= */}
        <section className="relative group rounded-3xl overflow-hidden p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/20">
          <div className="absolute inset-0 bg-white/90 dark:bg-[#161b22]/95 backdrop-blur-xl" />

          <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Academic Year 2025-26
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Welcome, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
                  {user?.name || "Future Engineer"}
                </span>{" "}
                👋
              </h1>

              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Your{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  digital campus workspace
                </span>
                . Access projects, connect with faculty, and discover
                opportunities in one unified hub.
              </p>
            </div>

            <div className="hidden md:block text-right">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                <span className="text-5xl font-bold text-white">BVC</span>
              </div>
              <p className="mt-4 font-bold text-slate-900 dark:text-white text-lg">
                BVC DigitalHub
              </p>
            </div>
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Active Projects"
            value={projects}
            suffix="+"
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Students Enrolled"
            value={students}
            suffix="+"
            color="from-violet-500 to-purple-500"
          />
          <StatCard
            title="Expert Faculty"
            value={faculty}
            suffix="+"
            color="from-fuchsia-500 to-pink-500"
          />
          <StatCard
            title="Placement Rate"
            value={placements}
            suffix="%"
            color="from-emerald-500 to-teal-500"
          />
        </section>

        {/* ================= INFO SECTION ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            title="About Our College"
            text="BVC College of Engineering emphasizes academic excellence, innovation, and real-world problem solving, empowering students to build industry-ready skills and future-proof careers."
            gradient="from-orange-500 to-amber-500"
          />

          <InfoCard
            title="Why DigitalHub?"
            gradient="from-sky-500 to-indigo-500"
            list={[
              "Centralized student projects repository",
              "Direct Faculty & department directory",
              "Exclusive Events & job opportunities",
              "Peer Collaboration & academic recognition",
            ]}
          />
        </section>
      </main>
    </div>
  );
};

export default Home;

/* ================= MODERN COMPONENTS ================= */

const StatCard = ({ title, value, suffix, color }) => (
  <div className="relative group bg-white dark:bg-[#161b22] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    {/* Hover Gradient Glow */}
    <div
      className={`absolute top-0 right-0 p-16 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-500 translate-x-10 -translate-y-10`}
    />

    <div className="relative z-10">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
        {title}
      </p>
      <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
        {value}
        <span
          className={`text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-br ${color}`}
        >
          {suffix}
        </span>
      </p>
    </div>
  </div>
);

const InfoCard = ({ title, text, list, gradient }) => (
  <div className="relative bg-white dark:bg-[#161b22] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden group">
    {/* Decorative Top Line */}
    <div
      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-80`}
    />

    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
      {title}
    </h2>

    {text && (
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg">
        {text}
      </p>
    )}

    {list && (
      <ul className="space-y-4">
        {list.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-slate-600 dark:text-slate-400 group/item hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span
              className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-[10px] text-white font-bold shadow-md`}
            >
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
