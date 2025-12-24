import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { Pencil, Trash2, Heart, MessageSquare, Share2 } from "lucide-react";

const ProjectCard = ({
  project,
  currentUserId,
  onUnauthLike,
  refresh,
  isOwner = false,
}) => {
  const navigate = useNavigate();

  const [likesCount, setLikesCount] = useState(project.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  /* ================= SYNC LIKE STATE ================= */
  useEffect(() => {
    if (project.likes && currentUserId) {
      setIsLiked(
        project.likes.some(
          (id) => id && id.toString() === currentUserId.toString()
        )
      );
    }
    setLikesCount(project.likes?.length || 0);
  }, [project.likes, currentUserId]);

  /* ================= LIKE ================= */
  const handleLike = async (e) => {
    e.stopPropagation();

    if (isOwner) return; // 🔒 Owner cannot like own project
    if (isLiking) return;

    if (!currentUserId) {
      onUnauthLike?.();
      return;
    }

    setIsLiking(true);

    const originalLikes = likesCount;
    const originalLiked = isLiked;

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const { data } = await API.post(`/projects/${project._id}/like`);
      setLikesCount(data.likes.length);
      setIsLiked(
        data.likes.some(
          (id) => id && id.toString() === currentUserId.toString()
        )
      );
    } catch {
      setLikesCount(originalLikes);
      setIsLiked(originalLiked);
      toast.error("Like failed", {
        autoClose: 1500,
      });
    } finally {
      setIsLiking(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project?")) return;

    try {
      await API.delete(`/projects/${project._id}`);
      toast.success("Project deleted", {
        autoClose: 1500,
      });
      refresh?.();
    } catch {
      toast.error("Delete failed", {
        autoClose: 1500,
      });
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/projects/edit/${project._id}`);
  };

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group relative cursor-pointer bg-white dark:bg-[#1e2329] 
      rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 
      hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Decorative Gradient Background (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* ================= USER INFO (HIDDEN FOR OWNER) ================= */}
      {!isOwner && (
        <div className="flex items-center gap-3 mb-5 relative z-10">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 
              flex items-center justify-center overflow-hidden border-2 border-white dark:border-[#1e2329] shadow-sm"
            >
              {project.user?.profilePic ? (
                <img
                  src={project.user.profilePic}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-bold text-lg text-blue-600 dark:text-blue-300">
                  {project.user?.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            {/* Status Indicator (Optional Visual Flair) */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1e2329] rounded-full"></div>
          </div>

          <div>
            <p className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.user?.name || "Unknown"}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 tracking-wide uppercase border border-blue-100 dark:border-blue-800">
              {project.user?.department || "GENERAL"}
            </span>
          </div>
        </div>
      )}

      {/* ================= TITLE ================= */}
      <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
        {project.title}
      </h3>

      {/* ================= DESCRIPTION ================= */}
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
        {project.description}
      </p>

      {/* ================= ACTIONS ================= */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {/* LIKE (HIDDEN FOR OWNER) */}
        {!isOwner ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
              }`}
            >
              <Heart
                size={18}
                className={`transition-transform duration-300 ${
                  isLiked ? "fill-current scale-110" : "scale-100"
                }`}
              />
              <span className="font-bold text-sm">{likesCount}</span>
            </button>

            {/* Placeholder for Comments/Share for future expansion, adds to 'flashy' look */}
            <button className="text-slate-400 hover:text-blue-500 transition-colors">
              <MessageSquare size={18} />
            </button>
            <button className="text-slate-400 hover:text-green-500 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        ) : (
          /* OWNER ACTIONS - VISIBLE ONLY IF OWNER */
          <div className="w-full flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              My Project
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                title="Edit Project"
              >
                <Pencil size={16} strokeWidth={2.5} />
              </button>

              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                title="Delete Project"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
