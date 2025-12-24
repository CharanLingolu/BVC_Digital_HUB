import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { FileText } from "lucide-react";

const JobApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post(`/info/jobs/${id}/apply`, form);

      toast.success("Application submitted successfully! Check your email 📧", {
        autoClose: 2000,
      });

      navigate("/jobs");
    } catch {
      toast.error("Failed to submit application. Try again.", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="h-24" />

      <main className="max-w-xl mx-auto p-6">
        <h1 className="text-3xl font-black mb-6">Apply for Job</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow space-y-4"
        >
          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          <input
            name="phone"
            placeholder="Mobile Number"
            required
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />

          {/* 📄 Resume Upload with Icon */}
          <label className="flex items-center gap-3 w-full p-3 border rounded-xl cursor-pointer text-slate-500 hover:bg-slate-50">
            <FileText size={20} />
            <span className="text-sm">Upload Resume (PDF / DOC)</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </label>

          <button
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default JobApply;
