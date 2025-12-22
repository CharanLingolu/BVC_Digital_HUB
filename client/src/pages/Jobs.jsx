import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/info/jobs")
      .then((res) => setJobs(res.data))
      .catch(() => console.error("Failed to load jobs"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Placements</h1>

        {jobs.length === 0 ? (
          <p>No job data available</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{job.company}</h3>
                <p className="text-sm">{job.role}</p>
                <p className="text-sm text-gray-600">
                  Selected Students: {job.selectedStudents.join(", ")}
                </p>
                <p className="text-sm">Year: {job.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Jobs;
