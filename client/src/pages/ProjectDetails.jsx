import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  Heart,
  ArrowLeft,
  ExternalLink,
  Share2,
  Clock,
  ShieldCheck,
  PlayCircle,
  Copy,
  Check,
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [copied, setCopied] = useState(false);
  const errorShownRef = useRef(false);

  // --- USER ID SYNC ---
  const getCurrentUserId = () => {
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("userInfo") ||
        localStorage.getItem("authUser");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return (
        parsed?._id ||
        parsed?.id ||
        parsed?.user?._id ||
        parsed?.user?.id ||
        null
      );
    } catch {
      return null;
    }
  };

  const [currentUserId, setCurrentUserId] = useState(getCurrentUserId());

  useEffect(() => {
    const syncUser = () => setCurrentUserId(getCurrentUserId());
    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  // --- FETCH PROJECT ---
  useEffect(() => {
    let cancelled = false;
    API.get(`/projects/${id}`)
      .then((res) => {
        if (cancelled) return;
        setProject({
          ...res.data,
          likes: Array.isArray(res.data.likes) ? res.data.likes : [],
          media: Array.isArray(res.data.media) ? res.data.media : [],
        });
      })
      .catch(() => {
        if (!errorShownRef.current) {
          errorShownRef.current = true;
          toast.error("Failed to load project", { autoClose: 1500 });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!project) {
    return (
      <div className="h-screen w-screen bg-slate-50 dark:bg-[#090c10] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse text-sm">
          Loading Project...
        </p>
      </div>
    );
  }

  const isLiked =
    !!currentUserId &&
    project.likes.some(
      (uid) => uid && uid.toString() === currentUserId.toString()
    );
  const likesCount = project.likes.length;
  const uName = project.user?.name || "Unknown Creator";
  const uDept = project.user?.department || project.user?.dept || "General";
  const postDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString()
    : "Recently";

  // --- ACTIONS ---
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const previousLikes = project.likes;

    setProject((prev) => ({
      ...prev,
      likes: isLiked
        ? prev.likes.filter(
            (uid) => uid && uid.toString() !== currentUserId.toString()
          )
        : [...prev.likes, currentUserId],
    }));

    try {
      const { data } = await API.post(`/projects/${project._id}/like`);
      setProject((prev) => ({ ...prev, likes: data.likes }));
    } catch {
      toast.error("Like failed", { autoClose: 1500 });
      setProject((prev) => ({ ...prev, likes: previousLikes }));
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    // Try Native Share
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: `Check out this project: ${project.title}`,
          url: url,
        });
        return;
      } catch (err) {
        console.log("Share cancelled");
      }
    }

    // Fallback to Clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#090c10] text-slate-900 dark:text-white font-sans selection:bg-blue-500/30 flex flex-col">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-30 mix-blend-soft-light dark:mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content Centered */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-6xl h-[85vh] bg-white/70 dark:bg-[#161b22]/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-white/5 overflow-hidden flex flex-col md:flex-row">
          {/* LEFT PANEL: Media Gallery (45%) */}
          <div className="w-full md:w-[45%] bg-slate-100 dark:bg-[#0d1117]/50 border-r border-white/50 dark:border-white/5 relative flex flex-col">
            {/* Back Button (Floating) */}
            <button
              onClick={() => navigate("/projects")}
              className="absolute top-6 left-6 z-20 p-2.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform text-slate-700 dark:text-white shadow-lg"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {project.media.length > 0 ? (
                project.media.map((url, index) => (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden bg-white dark:bg-black shadow-md border border-slate-200 dark:border-slate-800 group relative"
                  >
                    {url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video controls className="w-full h-auto object-cover">
                        <source src={url} />
                      </video>
                    ) : (
                      <img
                        src={url}
                        alt={`Project media ${index}`}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                  <PlayCircle size={48} className="mb-2" />
                  <p className="font-bold">No Media Uploaded</p>
                </div>
              )}
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-100 dark:from-[#0d1117] to-transparent pointer-events-none"></div>
          </div>

          {/* RIGHT PANEL: Details & Actions (55%) */}
          <div className="flex-1 flex flex-col h-full relative">
            {/* Header Info */}
            <div className="p-8 pb-4 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#161b22]/50 backdrop-blur-xl z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-[10px] overflow-hidden">
                    <Avatar user={project.user} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {uName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {uDept}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {postDate}
                    </span>
                  </div>
                </div>
              </div>

              <h1
                className="text-3xl font-black text-slate-900 dark:text-white leading-tight line-clamp-2"
                title={project.title}
              >
                {project.title}
              </h1>
            </div>

            {/* Scrollable Description */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#161b22]/80 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all transform active:scale-[0.98] ${
                    isLiked
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  <Heart size={20} className={isLiked ? "fill-current" : ""} />
                  <span>{likesCount}</span>
                </button>

                {/* Repo Link */}
                {project.repoLink && (
                  <a
                    href={project.repoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                  >
                    <ExternalLink size={18} /> Repo
                  </a>
                )}

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-95"
                  title="Share Project"
                >
                  {copied ? <Check size={20} /> : <Share2 size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;

// Helper Avatar
const Avatar = ({ user }) => {
  const name = user?.name || "?";
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-black text-slate-400 text-lg">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};
