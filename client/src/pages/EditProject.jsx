import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [existingMedia, setExistingMedia] = useState([]);
  const [removedMedia, setRemovedMedia] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    API.get(`/projects/${id}`)
      .then((res) => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setRepoLink(res.data.repoLink || "");
        setExistingMedia(res.data.media || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const removeExisting = (url) => {
    setRemovedMedia((prev) => [...prev, url]);
    setExistingMedia((prev) => prev.filter((m) => m !== url));
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("repoLink", repoLink);
    removedMedia.forEach((m) => data.append("removedMedia[]", m));
    Array.from(newFiles).forEach((f) => data.append("media", f));

    try {
      await API.put(`/projects/${id}`, data);
      toast.success("Project updated", {
        autoClose: 1500,
      });
      navigate(`/projects/${id}`);
    } catch {
      toast.error("Update failed", {
        autoClose: 1500,
      });
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Edit Project
        </h1>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white dark:bg-[#161b22] text-slate-900 dark:text-white border"
          placeholder="Title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-white dark:bg-[#161b22] text-slate-900 dark:text-white border h-32"
          placeholder="Description"
        />

        <input
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          className="w-full mb-6 p-3 rounded-xl bg-white dark:bg-[#161b22] text-slate-900 dark:text-white border"
          placeholder="Repository Link"
        />

        {existingMedia.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            {existingMedia.map((m) => (
              <div key={m} className="relative">
                <img src={m} className="rounded-xl" />
                <button
                  onClick={() => removeExisting(m)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          multiple
          onChange={(e) => setNewFiles(e.target.files)}
          className="mb-6 text-slate-500"
        />

        <button
          onClick={handleUpdate}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl"
        >
          Save Changes
        </button>
      </main>
    </div>
  );
};

export default EditProject;
