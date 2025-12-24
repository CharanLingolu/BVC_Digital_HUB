import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  Camera,
  User,
  GraduationCap,
  Code,
  FileText,
  CheckCircle,
  Upload,
} from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("department", formData.department);
      data.append("year", formData.year);
      data.append("rollNumber", formData.rollNumber);
      data.append("bio", formData.bio);
      data.append(
        "skills",
        JSON.stringify(
          formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      await API.put("/users/onboarding", data);
      toast.success("Profile completed successfully!", { autoClose: 1500 });
      navigate("/home");
    } catch {
      toast.error("Onboarding failed. Please check your details.", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070a] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/50 transition-colors duration-500">
      <Navbar />

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="h-20" />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-24 animate-fade-in-up">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-black shadow-lg shadow-indigo-500/30 mb-6 transform rotate-3 hover:rotate-6 transition-transform">
            3
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-indigo-100 dark:to-purple-200 mb-4 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            Let's personalize your experience. This information helps recruiters
            and faculty connect with you.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white/70 dark:bg-[#161b22]/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/10 p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Top Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* SECTION 1: PROFILE PICTURE */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                {/* Glow behind avatar */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-[#161b22] bg-slate-100 dark:bg-[#0d1117] shadow-xl">
                  {preview ? (
                    <img
                      src={preview}
                      alt="profile"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <User className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Upload
                      </span>
                    </div>
                  )}

                  {/* Upload Overlay */}
                  <label
                    htmlFor="profilePic"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white drop-shadow-md" />
                  </label>
                </div>

                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfilePic(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                Tap image to upload photo
              </p>
            </div>

            {/* SECTION 2: ACADEMIC INFO */}
            <Section
              title="Academic Information"
              icon={<GraduationCap className="w-5 h-5" />}
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0d1117]/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer hover:bg-white dark:hover:bg-[#0d1117]"
                >
                  <option value="" className="dark:bg-[#161b22]">
                    Select Department
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

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="h-5 w-5 flex items-center justify-center text-slate-400 font-bold group-focus-within:text-indigo-500 transition-colors">
                    #
                  </div>
                </div>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0d1117]/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer hover:bg-white dark:hover:bg-[#0d1117]"
                >
                  <option value="" className="dark:bg-[#161b22]">
                    Select Year
                  </option>
                  <option value="1" className="dark:bg-[#161b22]">
                    1st Year
                  </option>
                  <option value="2" className="dark:bg-[#161b22]">
                    2nd Year
                  </option>
                  <option value="3" className="dark:bg-[#161b22]">
                    3rd Year
                  </option>
                  <option value="4" className="dark:bg-[#161b22]">
                    4th Year
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
            </Section>

            {/* SECTION 3: PERSONAL DETAILS */}
            <Section
              title="Personal Details"
              icon={<User className="w-5 h-5" />}
            >
              <Input
                icon={<User className="w-5 h-5" />}
                label="Roll Number"
                name="rollNumber"
                placeholder="e.g. 21BVC1A0501"
                onChange={handleChange}
                required
              />
              <Input
                icon={<Code className="w-5 h-5" />}
                label="Top Skills"
                name="skills"
                placeholder="React, Java, Python..."
                onChange={handleChange}
              />
            </Section>

            {/* SECTION 4: BIO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <label className="text-lg font-bold text-slate-900 dark:text-white">
                  Professional Bio
                </label>
              </div>
              <div className="relative group">
                <textarea
                  name="bio"
                  rows="4"
                  placeholder="Tell us about your interests, achievements, and career goals..."
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0d1117]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none hover:bg-white dark:hover:bg-[#0d1117]"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <span>Finish & Go to Dashboard</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;

/* ---------- REUSABLE UI ---------- */

const Section = ({ title, icon, children }) => (
  <div className="animate-fade-in-up">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const Input = ({ label, icon, ...props }) => (
  <div className="space-y-2 group">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <div className="text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
      </div>
      <input
        {...props}
        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0d1117]/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all hover:bg-white dark:hover:bg-[#0d1117]"
      />
      {/* Input Glow */}
      <div className="absolute inset-0 rounded-2xl bg-indigo-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
    </div>
  </div>
);

// Import ArrowRight for the button (if not already imported)
import { ArrowRight } from "lucide-react";
