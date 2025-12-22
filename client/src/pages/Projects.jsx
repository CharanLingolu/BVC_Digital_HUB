import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Student Projects
        </h1>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                refresh={fetchProjects}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;
