import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { toast } from "react-toastify";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  UploadCloud,
  GraduationCap,
  Briefcase,
  BookOpen,
  Clock,
  Sparkles,
} from "lucide-react";

/* ================= CONSTANTS ================= */

const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
const POSITIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "HOD",
];

/* ================= HELPERS ================= */

const normalizeSubjects = (subjects) => {
  if (!subjects) return [];
  if (Array.isArray(subjects)) return subjects;
  if (typeof subjects === "string")
    return subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

/* ================= MAIN COMPONENT ================= */

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");

  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);

  const token = localStorage.getItem("adminToken");

  /* -------- FETCH -------- */
  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  /* -------- HANDLERS -------- */
  const handleAddClick = () => {
    setForm({});
    setFile(null);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (s) => {
    setEditingStaff(s);
    setForm({
      ...s,
      subjects: normalizeSubjects(s.subjects).join(", "),
    });
    setFile(null);
  };

  const addStaff = async () => {
    if (!form.name || !form.department || !form.position) {
      toast.error("Name, Department and Position are required");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("photo", file);

      await axios.post("http://localhost:5000/api/admin/staff", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Staff added successfully", { autoClose: 1500 });
      setIsAddModalOpen(false);
      fetchStaff();
    } catch (error) {
      toast.error("Failed to add staff");
    }
  };

  const updateStaff = async () => {
    if (!form.name || !form.department || !form.position) {
      toast.error("Name, Department and Position are required");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append("photo", file);

      await axios.put(
        `http://localhost:5000/api/admin/staff/${editingStaff._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Staff updated", { autoClose: 1500 });
      setEditingStaff(null);
      fetchStaff();
    } catch (error) {
      toast.error("Failed to update staff");
    }
  };

  const deleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Staff deleted");
      fetchStaff();
    } catch (error) {
      toast.error("Failed to delete staff");
    }
  };

  /* -------- FILTER -------- */
  const filtered = staff.filter(
    (s) =>
      (dept === "" || s.department === dept) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-rose-500/30 transition-colors duration-300">
      <AdminNavbar />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>

      {/* Background Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              {/* Icon Container with Bounce Hover */}
              <span className="cursor-pointer p-2.5 rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 text-white shadow-lg shadow-rose-500/30 transition-all duration-300 ease-out hover:scale-110 hover:-rotate-6 hover:shadow-rose-500/50">
                <Users className="w-6 h-6" />
              </span>

              {/* Glossy Text */}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-600 to-purple-600 dark:from-rose-300 dark:via-fuchsia-300 dark:to-purple-300 drop-shadow-sm">
                Faculty Hub
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">
              Manage profiles, roles, and academic details for staff members.
            </p>
          </div>

          <button
            onClick={handleAddClick}
            className="group relative overflow-hidden rounded-2xl py-4 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            Add Faculty Member
          </button>
        </div>

        {/* Toolbar */}
        <div className="sticky top-24 z-30 mb-10 p-2 rounded-[1.5rem] bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-indigo-500/5">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                placeholder="Search faculty by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-transparent text-slate-900 dark:text-white text-lg placeholder-slate-400 outline-none focus:bg-white/50 dark:focus:bg-[#0d1117]/50 transition-all"
              />
            </div>
            <div className="relative md:w-72 group">
              <Filter className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full pl-14 pr-10 py-4 rounded-2xl bg-transparent text-slate-900 dark:text-white text-lg appearance-none cursor-pointer outline-none focus:bg-white/50 dark:focus:bg-[#0d1117]/50 transition-all"
              >
                <option value="" className="dark:bg-[#161b22]">
                  All Departments
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="dark:bg-[#161b22]">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.length > 0 ? (
            filtered.map((s) => (
              <StaffCard
                key={s._id}
                s={s}
                onView={() => setViewStaff(s)}
                onEdit={() => handleEditClick(s)}
                onDelete={() => deleteStaff(s._id)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-50">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-2xl font-bold">No staff members found</h3>
            </div>
          )}
        </div>
      </main>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <Modal title="Add New Faculty" onClose={() => setIsAddModalOpen(false)}>
          <StaffForm
            form={form}
            setForm={setForm}
            file={file}
            setFile={setFile}
            onSubmit={addStaff}
            submitText="Add Staff Member"
            icon={Plus}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editingStaff && (
        <Modal title="Edit Staff Details" onClose={() => setEditingStaff(null)}>
          <StaffForm
            form={form}
            setForm={setForm}
            file={file}
            setFile={setFile}
            onSubmit={updateStaff}
            submitText="Save Changes"
            icon={Save}
          />
        </Modal>
      )}

      {/* VIEW MODAL */}
      {viewStaff && (
        <StaffDetailsModal
          staff={viewStaff}
          onClose={() => setViewStaff(null)}
        />
      )}
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const StaffCard = ({ s, onView, onEdit, onDelete }) => (
  <div className="group relative bg-white/60 dark:bg-[#161b22]/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 flex flex-col">
    <div
      className="h-52 relative overflow-hidden shrink-0 cursor-pointer"
      onClick={onView}
    >
      {s.photo ? (
        <img
          src={s.photo}
          alt={s.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <span className="text-6xl font-black text-white/30">{s.name[0]}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090c10] via-transparent to-transparent opacity-80" />

      <div className="absolute bottom-4 left-6 right-6">
        <h3 className="text-2xl font-black text-white truncate">{s.name}</h3>
        <p className="text-indigo-300 text-sm font-bold uppercase tracking-wider">
          {s.position}
        </p>
      </div>

      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
        {s.department}
      </span>
    </div>

    <div className="p-6 flex flex-col flex-1">
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-rose-500" />
          <p className="text-xs font-black">{s.experience || 0} Yrs</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Exp.</p>
        </div>
        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
          <GraduationCap className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
          <p className="text-xs font-black truncate">
            {s.qualification || "N/A"}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">
            Degree
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
        >
          <Edit2 size={16} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 font-bold text-sm hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
    <div className="relative w-full max-w-2xl bg-white/80 dark:bg-[#161b22]/90 backdrop-blur-2xl rounded-[2.5rem] shadow-3xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]">
      <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600 shrink-0 flex items-center px-8 relative">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Sparkles className="w-6 h-6" /> {title}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  </div>
);

const StaffForm = ({
  form,
  setForm,
  file,
  setFile,
  onSubmit,
  submitText,
  icon: Icon,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input
        label="Full Name"
        placeholder="Dr. Jane Smith"
        value={form.name || ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        label="Qualification"
        placeholder="Ph.D, M.Tech"
        value={form.qualification || ""}
        onChange={(e) => setForm({ ...form, qualification: e.target.value })}
      />
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
          Position
        </label>
        <select
          className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          value={form.position || ""}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        >
          <option value="">Select Position</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
          Department
        </label>
        <select
          className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
          value={form.department || ""}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        >
          <option value="">Select Dept</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Experience (Years)"
        type="number"
        placeholder="10"
        value={form.experience || ""}
        onChange={(e) => setForm({ ...form, experience: e.target.value })}
      />
      <Input
        label="Subjects"
        placeholder="Data Structures, AI"
        value={form.subjects || ""}
        onChange={(e) => setForm({ ...form, subjects: e.target.value })}
      />
    </div>

    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        Biography
      </label>
      <textarea
        className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 resize-none"
        placeholder="Professional background..."
        value={form.bio || ""}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
      />
    </div>

    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        Profile Photo
      </label>
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:border-indigo-400 transition-all cursor-pointer">
        <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
        <span className="text-sm font-bold text-indigo-500">
          {file ? file.name : "Click to upload image"}
        </span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>
    </div>

    <button
      onClick={onSubmit}
      className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-lg shadow-xl shadow-indigo-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
    >
      <Icon size={20} /> {submitText}
    </button>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-4 rounded-2xl bg-white/50 dark:bg-[#0d1117]/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  </div>
);

const StaffDetailsModal = ({ staff, onClose }) => {
  const subjects = normalizeSubjects(staff.subjects);
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#161b22] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-violet-800 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-48 h-48 rounded-full border-4 border-white/20 p-1 mb-6 shadow-2xl">
            {staff.photo ? (
              <img
                src={staff.photo}
                className="w-full h-full object-cover rounded-full"
                alt=""
              />
            ) : (
              <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-6xl font-black text-white/40">
                {staff.name[0]}
              </div>
            )}
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-2">
            {staff.name}
          </h2>
          <p className="text-indigo-200 font-bold uppercase tracking-widest text-sm">
            {staff.position}
          </p>
        </div>
        <div className="flex-1 p-12 relative overflow-y-auto custom-scrollbar max-h-[80vh]">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-500 hover:text-white"
          >
            <X />
          </button>
          <div className="space-y-10">
            <div>
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">
                Academic Background
              </h4>
              <p className="text-2xl font-bold text-white leading-snug">
                {staff.qualification || "Qualification details hidden"}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black text-rose-400 uppercase tracking-[0.2em] mb-4">
                Subjects Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl font-bold text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                Biography
              </h4>
              <p className="text-slate-400 leading-relaxed text-lg">
                {staff.bio || "No biography provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
