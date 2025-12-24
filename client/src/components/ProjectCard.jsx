import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { Pencil, Trash2, Heart, User, Layers } from "lucide-react";

const ProjectCard = ({
  project,
  currentUserId,
  onUnauthLike,
  refresh,
  isOwner = false,
}) => {
  const navigate = useNavigate();

  // Local state initialized with a safety check
  const [likes, setLikes] = useState(project?.likes || []);
  const [isLiking, setIsLiking] = useState(false);

  // Sync state if parent props change
  useEffect(() => {
    setLikes(project?.likes || []);
  }, [project?.likes]);

  // CRITICAL FIX: Ensure both IDs are converted to Strings for comparison
  const safeUserId = currentUserId ? String(currentUserId) : null;
  const isLiked = safeUserId && likes.some((uid) => String(uid) === safeUserId);
  const likesCount = likes.length;

  const handleLike = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to like!");
      return;
    }

    if (isOwner || isLiking) return;

    setIsLiking(true);

    try {
      // ✅ Backend is the ONLY source of truth
      const { data } = await API.post(`/projects/${project._id}/like`);

      // Update likes strictly from server response
      setLikes(data.likes);
    } catch (err) {
      console.error(err);
      toast.error("Like failed");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project?")) return;
    try {
      await API.delete(`/projects/${project._id}`);
      toast.success("Project deleted");
      refresh?.();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/projects/edit/${project._id}`);
  };

  return (
    <>
      {/* Custom Pulse Animation */}
      <style>{`
        @keyframes heartPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: heartPop 0.4s cubic-bezier(0.17, 0.89, 0.32, 1.49);
        }
      `}</style>

      <div
        onClick={() => navigate(`/projects/${project?._id}`)}
        className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] 
             bg-white/90 dark:bg-[#0a0a0f]/95 backdrop-blur-3xl 
             border border-slate-200 dark:border-white/10 
             shadow-xl flex flex-col h-full min-h-[280px]
             /* --- LEFT FALL TRANSITION --- */
             transition-all duration-500 ease-out
             hover:-translate-y-2 hover:-rotate-1 hover:scale-[1.01]
             hover:shadow-[10px_20px_50px_-20px_rgba(99,102,241,0.3)]"
      >
        <div className="p-8 flex flex-col h-full relative z-10">
          {/* Creator Header */}
          {!isOwner && (
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#16161a] border border-slate-200 dark:border-white/10 flex items-center justify-center">
                {project.user?.profilePic ? (
                  <img
                    src={project.user.profilePic}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-base truncate leading-none mb-1">
                  {project.user?.name || "Unknown"}
                </p>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  {project.user?.department || "CSE"}
                </span>
              </div>
            </div>
          )}

          <h3 className="text-2xl font-black mb-3 text-slate-900 dark:text-white leading-tight group-hover:text-indigo-500 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8">
            {project.description}
          </p>

          {/* Action Footer */}
          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            {!isOwner ? (
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2.5 transition-all duration-300 active:scale-90 group/heart 
    /* --- COLOR LOGIC: Red if liked, Slate to Red-400 on hover if not --- */
    ${
      isLiked
        ? "text-red-500"
        : "text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400"
    }`}
              >
                <Heart
                  size={26}
                  className={`transition-all duration-500 
      /* --- HOVER EFFECTS: Left Fall + Scale + Stroke Weight --- */
      group-hover/heart:-rotate-12 
      group-hover/heart:scale-110
      group-hover/heart:drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]
      
      ${
        isLiked
          ? "fill-red-500 stroke-red-500 animate-pop drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
          : "fill-none stroke-current"
      }`}
                />

                <span className="font-black text-lg transition-colors duration-300">
                  {likesCount}
                </span>
              </button>
            ) : (
              <div className="w-full flex justify-between items-center">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-60">
                  Author Tools
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
