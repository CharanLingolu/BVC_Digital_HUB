import API from "../services/api";
import { toast } from "react-toastify";

const ProjectCard = ({ project, refresh }) => {
  const handleLike = async () => {
    try {
      await API.post(`/projects/${project._id}/like`);
      toast.success("Project liked");
      refresh();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Like failed"
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold">{project.title}</h3>

      <p className="text-sm text-gray-600 mt-1">
        By {project.user?.name}
      </p>

      <p className="mt-2 text-gray-700">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-2">
        {project.techStack.map((tech, i) => (
          <span
            key={i}
            className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleLike}
          className="text-red-500 font-medium"
        >
          ❤️ {project.likes.length}
        </button>

        {project.repoLink && (
          <a
            href={project.repoLink}
            target="_blank"
            className="text-blue-600 text-sm"
          >
            View Repo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
