import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Staff = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    API.get("/info/staff")
      .then((res) => setStaff(res.data))
      .catch(() => console.error("Failed to load staff"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Faculty</h1>

        {staff.length === 0 ? (
          <p>No staff data available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {staff.map((s) => (
              <div key={s._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{s.name}</h3>
                <p className="text-sm text-gray-600">{s.department}</p>
                <p className="text-sm">{s.designation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Staff;
