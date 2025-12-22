import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-toastify";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AuthCard from "../components/ui/AuthCard";
import PageContainer from "../components/ui/PageContainer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: "",
  });

  // 🔹 Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);

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

  // 🔹 Fetch my projects
  const fetchMyProjects = async () => {
    try {
      const res = await API.get("/projects/my");
      setProjects(res.data);
    } catch {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyProjects();
  }, []);

  // 🔹 Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/users/me", {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()),
      });
      toast.success("Profile updated");
      setEditing(false);
      fetchProfile();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>

        {user && (
          <div className="mb-6 bg-white p-4 rounded shadow">
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Department:</b> {user.department}</p>
            <p><b>Year:</b> {user.year}</p>
            <p><b>Roll No:</b> {user.rollNumber}</p>
            <p><b>Bio:</b> {user.bio}</p>
            <p><b>Followers:</b> {user.followers.length}</p>
            <p><b>Following:</b> {user.following.length}</p>

            <Button
              variant="outline"
              className="mt-3"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        )}

        {editing && (
          <PageContainer>
            <AuthCard title="Edit Profile">
              <form onSubmit={handleUpdate} className="space-y-3">
                <Input
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />

                <Input
                  placeholder="Year"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                />

                <Input
                  placeholder="Roll Number"
                  value={formData.rollNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNumber: e.target.value })
                  }
                />

                <Input
                  placeholder="Skills (comma separated)"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                />

                <textarea
                  className="w-full border rounded p-2"
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />

                <Button type="submit">Save Changes</Button>
              </form>
            </AuthCard>
          </PageContainer>
        )}

        <h2 className="text-xl font-bold mt-8 mb-4">My Projects</h2>

        {projects.length === 0 ? (
          <p>No projects yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                refresh={fetchMyProjects}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
