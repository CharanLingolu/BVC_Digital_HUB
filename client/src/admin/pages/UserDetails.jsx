import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminAPI from "../../services/adminApi";
import AdminNavbar from "../components/AdminNavbar";
import {
  User,
  Mail,
  Hash,
  BookOpen,
  FileText,
  Save,
  X,
  Trash2,
  Edit2,
  Camera,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    adminAPI.get(`/admin/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  /* ================= UPDATE USER ================= */
  const updateUser = async () => {
    try {
      const data = new FormData();
      data.append("name", user.name);
      data.append("email", user.email);
      data.append("rollNumber", user.rollNumber || "");
      data.append("department", user.department || "");
      data.append("bio", user.bio || "");

      if (profilePicFile) {
        data.append("profilePic", profilePicFile);
      }

      const res = await adminAPI.put(`/admin/users/${id}`, data);

      if (res.data && res.data.user) {
        setUser(res.data.user);
      }

      toast.success("Profile updated successfully");
      setEditing(false);
      setProfilePicFile(null);
    } catch {
      toast.error("Update failed. Please try again.");
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async () => {
    if (
      !window.confirm("Are you sure you want to delete this user permanently?")
    )
      return;
    try {
      await adminAPI.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      navigate("/admin/users");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  if (!user)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-rose-500/30 flex flex-col">
      <AdminNavbar />

      {/* Background Decorative Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 dark:bg-rose-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content - Centered & Fixed Height */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-6xl h-[85vh] bg-white/70 dark:bg-[#161b22]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-white/5 overflow-hidden flex flex-col md:flex-row">
          {/* LEFT PANEL: Profile & Actions (35% Width) */}
          <div className="w-full md:w-[35%] bg-gradient-to-br from-slate-100 to-white dark:from-[#0d1117] dark:to-[#161b22] border-r border-white/50 dark:border-white/5 p-8 flex flex-col items-center justify-center relative">
            <button
              onClick={() => navigate("/admin/users")}
              className="absolute top-8 left-8 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
              title="Back to Users"
            >
              <ArrowLeft
                size={20}
                className="text-slate-500 dark:text-slate-400"
              />
            </button>

            {/* Avatar Section */}
            <div className="relative group mb-6">
              <div className="w-48 h-48 rounded-[2.5rem] p-1.5 bg-white dark:bg-[#161b22] shadow-2xl shadow-indigo-500/10">
                <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                  {preview || user.profilePic ? (
                    <img
                      src={preview || user.profilePic}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-6xl font-black">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  {/* Camera Overlay */}
                  {editing && (
                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                      <Camera className="text-white w-10 h-10 mb-2" />
                      <span className="text-white text-xs font-bold uppercase tracking-wider">
                        Change
                      </span>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setProfilePicFile(file);
                            setPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center leading-tight mb-2">
              {user.name}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium text-sm mb-8">
              <ShieldCheck size={14} className="text-blue-500" />
              {user.department || "Student"}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {!editing ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} /> Edit Profile
                  </button>
                  <button
                    onClick={deleteUser}
                    className="w-full py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all border border-rose-200 dark:border-rose-900/30 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} /> Delete User
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={updateUser}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setPreview(null);
                      setProfilePicFile(null);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300"
                  >
                    <X size={18} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Details Form (65% Width) */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Full Name"
                value={user.name}
                onChange={(v) => setUser({ ...user, name: v })}
                disabled={!editing}
                icon={User}
              />
              <Input
                label="Email Address"
                value={user.email}
                onChange={(v) => setUser({ ...user, email: v })}
                disabled={!editing}
                icon={Mail}
              />
              <Input
                label="Roll Number"
                value={user.rollNumber || ""}
                onChange={(v) => setUser({ ...user, rollNumber: v })}
                disabled={!editing}
                icon={Hash}
              />
              <Select
                label="Department"
                value={user.department || ""}
                onChange={(v) => setUser({ ...user, department: v })}
                disabled={!editing}
                icon={BookOpen}
              />
            </div>

            <div className="h-full max-h-[250px]">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                <FileText size={14} /> Bio & Details
              </label>
              <textarea
                className={`w-full h-[calc(100%-2rem)] p-5 rounded-[1.5rem] bg-white/50 dark:bg-[#0d1117]/50 border transition-all resize-none outline-none focus:ring-2 focus:ring-blue-500/50 
                    ${
                      !editing
                        ? "border-transparent text-slate-600 dark:text-slate-300 leading-relaxed"
                        : "border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    }`}
                placeholder="No additional details provided..."
                disabled={!editing}
                value={user.bio || ""}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetails;

/* ---------- UI COMPONENTS ---------- */

const Input = ({ label, value, onChange, disabled, icon: Icon }) => (
  <div className="group w-full">
    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
      {Icon && <Icon size={14} className={!disabled ? "text-blue-500" : ""} />}{" "}
      {label}
    </label>
    <input
      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border transition-all outline-none focus:ring-2 focus:ring-blue-500/50
      ${
        disabled
          ? "border-transparent text-slate-600 dark:text-slate-300 font-bold"
          : "border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium bg-white dark:bg-black/20"
      }`}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Select = ({ label, value, onChange, disabled, icon: Icon }) => (
  <div className="group w-full">
    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
      {Icon && <Icon size={14} className={!disabled ? "text-blue-500" : ""} />}{" "}
      {label}
    </label>
    <div className="relative">
      <select
        className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border transition-all outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none
         ${
           disabled
             ? "border-transparent text-slate-600 dark:text-slate-300 font-bold"
             : "border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer bg-white dark:bg-black/20"
         }`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
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
      {!disabled && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg
            className="w-4 h-4"
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
      )}
    </div>
  </div>
);
