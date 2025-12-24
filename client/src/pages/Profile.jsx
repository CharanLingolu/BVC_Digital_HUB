import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-toastify";
import { Camera, Upload, X, Save, Edit3, Plus, User } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);

  // Profile pic states
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  // Add project states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    repoLink: "",
    files: [],
  });

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: "",
  });

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
      setPreview(res.data.profilePic || null);

      setFormData({
        department: res.data.department || "",
        year: res.data.year || "",
        rollNumber: res.data.rollNumber || "",
        bio: res.data.bio || "",
        skills: (res.data.skills || []).join(", "),
      });
    } catch {
      toast.error("Failed to load profile");
    }
  };

  /* ================= FETCH PROJECTS ================= */
  const fetchMyProjects = async () => {
    try {
      const res = await API.get("/projects/my");
      setProjects(res.data);
    } catch {
      console.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyProjects();
  }, []);

  /* ================= UPDATE PROFILE (FIXED FOR REAL) ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // ---------- CASE 1: NO IMAGE → SEND JSON ----------
      if (!profilePic) {
        const payload = {
          department: formData.department,
          year: formData.year,
          rollNumber: formData.rollNumber,
          bio: formData.bio,
          skills: formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };

        await API.put("/users/me", payload);

        toast.success("Profile updated successfully ✅", { autoClose: 1500 });
        setEditing(false);
        await fetchProfile();
        return;
      }

      // ---------- CASE 2: IMAGE EXISTS → SEND FORMDATA ----------
      const data = new FormData();

      data.append("department", formData.department);
      data.append("year", formData.year);
      data.append("rollNumber", formData.rollNumber);
      data.append("bio", formData.bio);

      formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((skill) => data.append("skills[]", skill));

      data.append("profilePic", profilePic);

      await API.put("/users/me", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully ✅", { autoClose: 1500 });
      setEditing(false);
      setProfilePic(null);
      await fetchProfile();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      toast.error("Update failed ❌", { autoClose: 1500 });
    }
  };

  /* ================= CREATE PROJECT ================= */
  const handleCreateProject = async () => {
    if (!projectForm.title || !projectForm.description) {
      return toast.error("Title and description required", { autoClose: 1500 });
    }

    const data = new FormData();
    data.append("title", projectForm.title);
    data.append("description", projectForm.description);
    data.append("repoLink", projectForm.repoLink);

    Array.from(projectForm.files).forEach((file) => {
      data.append("media", file);
    });

    try {
      setUploading(true);
      await API.post("/projects", data);
      toast.success("Project added", { autoClose: 1500 });
      setShowProjectModal(false);
      setProjectForm({ title: "", description: "", repoLink: "", files: [] });
      fetchMyProjects();
    } catch {
      toast.error("Project upload failed", { autoClose: 1500 });
    } finally {
      setUploading(false);
    }
  };

  /* ================= 🖥️ MODERN UI ================= */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* Background Decorative Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="h-24" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pb-20">
        {/* ================= PROFILE HEADER ================= */}
        {user && (
          <div className="relative mb-12 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-[2.5rem] opacity-30 blur-xl group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
              {/* Banner */}
              <div className="h-40 md:h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
              </div>

              <div className="px-6 md:px-12 pb-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 -mt-16 md:-mt-20">
                  {/* PROFILE PIC */}
                  <div className="relative group/avatar shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white dark:bg-[#0d1117] p-1.5 shadow-2xl">
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#161b22] relative border border-white dark:border-slate-700">
                        {preview ? (
                          <img
                            src={preview}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#161b22] dark:to-[#0d1117]">
                            <User className="w-12 h-12 md:w-16 md:h-16 text-slate-400" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 cursor-pointer">
                          <Camera className="text-white w-6 h-6 md:w-8 md:h-8" />
                        </div>

                        <input
                          id="profilePic"
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setProfilePic(file);
                              setPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* INFO & ACTIONS */}
                  <div className="flex-1 w-full text-center md:text-left pt-2 md:pt-24">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div className="space-y-1">
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
                          {user.name}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={() => setEditing(!editing)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm mx-auto md:mx-0"
                      >
                        {editing ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Edit3 className="w-4 h-4" />
                        )}
                        {editing ? "Cancel Edit" : "Edit Profile"}
                      </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                      <InfoItem label="Department" value={user.department} />
                      <InfoItem label="Year" value={user.year} />
                      <InfoItem label="Roll No" value={user.rollNumber} />
                      <InfoItem label="Projects" value={projects.length} />
                    </div>

                    <div className="space-y-4">
                      {/* Bio */}
                      <div className="bg-slate-50 dark:bg-[#0d1117]/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/50">
                        <h3 className="text-xs font-bold uppercase text-indigo-500 mb-2 tracking-widest">
                          About Me
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                          {user.bio ||
                            "No bio added yet. Tell us about yourself!"}
                        </p>
                      </div>

                      {/* Skills Display Block */}
                      <div className="bg-slate-50 dark:bg-[#0d1117]/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/50 text-left">
                        <h3 className="text-xs font-bold uppercase text-purple-500 mb-3 tracking-widest">
                          Skills & Tech Stack
                        </h3>
                        <div className="bg-white dark:bg-[#0d1117] p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                          <p className="text-slate-700 dark:text-slate-300 font-semibold">
                            {(() => {
                              if (!user.skills) return "No skills listed yet.";

                              // Case 1: already an array
                              if (Array.isArray(user.skills)) {
                                return user.skills.join(", ");
                              }

                              // Case 2: string like ["React","NodeJs","Python"]
                              if (typeof user.skills === "string") {
                                try {
                                  const parsed = JSON.parse(user.skills);
                                  if (Array.isArray(parsed)) {
                                    return parsed.join(", ");
                                  }
                                  return user.skills;
                                } catch {
                                  // fallback: remove brackets & quotes manually
                                  return user.skills
                                    .replace(/[\[\]"]/g, "")
                                    .replace(/\s*,\s*/g, ", ");
                                }
                              }

                              return "No skills listed yet.";
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= EDIT PROFILE FORM ================= */}
        {editing && (
          <div className="mb-12 animate-fade-in-down">
            <div className="bg-white dark:bg-[#161b22] rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Edit3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  Update Details
                </h2>
              </div>

              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Input
                  label="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
                <Input
                  label="Year"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />
                <Input
                  label="Roll Number"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                />
                <Input
                  label="Skills (comma separated)"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                    Bio
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Short bio..."
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end mt-4">
                  <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= PROJECTS SECTION ================= */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                My Projects
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Manage and showcase your work.
              </p>
            </div>

            <button
              onClick={() => setShowProjectModal(true)}
              className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#161b22] hover:bg-slate-50 dark:hover:bg-[#1c2128] text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              Add Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div
              className="py-24 flex flex-col items-center justify-center bg-white dark:bg-[#161b22] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center group cursor-pointer hover:border-indigo-500/50 transition-colors"
              onClick={() => setShowProjectModal(true)}
            >
              <div className="w-20 h-20 bg-slate-50 dark:bg-[#0d1117] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No projects yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Start building your portfolio by adding your first project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  isOwner={true}
                  refresh={fetchMyProjects}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ================= ADD PROJECT MODAL ================= */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#161b22] rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] my-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-[#0d1117]/50 sticky top-0 z-10 rounded-t-3xl">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                Create New Project
              </h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <Input
                label="Project Title"
                placeholder="e.g. AI Plant Disease Detector"
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, title: e.target.value })
                }
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  Description
                </label>
                <textarea
                  className="w-full p-4 h-32 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none placeholder:text-slate-400"
                  placeholder="Describe your project functionality and tech stack..."
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <Input
                label="GitHub Repository"
                placeholder="https://github.com/username/repo"
                value={projectForm.repoLink}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, repoLink: e.target.value })
                }
              />

              <div className="pt-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                  Upload Media
                </label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 md:p-8 text-center hover:bg-slate-50 dark:hover:bg-[#0d1117] transition-colors">
                  <Upload className="w-6 h-6 md:w-8 md:h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-xs md:text-sm text-slate-500">
                    Click to upload images or videos
                  </p>
                  <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, files: e.target.files })
                    }
                  />
                </div>
                {projectForm.files.length > 0 && (
                  <p className="mt-2 text-sm text-indigo-500 font-medium">
                    {projectForm.files.length} files selected
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-[#0d1117]/50 rounded-b-3xl sticky bottom-0">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={uploading}
                onClick={handleCreateProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Post Project"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= MODERN COMPONENTS ================= */

const Input = ({ label, placeholder, value, onChange }) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
        {label}
      </label>
    )}
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all"
    />
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="bg-slate-50 dark:bg-[#0d1117]/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
      {label}
    </p>
    <p className="text-sm md:text-lg font-black text-slate-800 dark:text-slate-200 truncate">
      {value || "—"}
    </p>
  </div>
);

export default Profile;
