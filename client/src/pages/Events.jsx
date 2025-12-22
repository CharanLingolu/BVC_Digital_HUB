import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/info/events")
      .then((res) => setEvents(res.data))
      .catch(() => console.error("Failed to load events"));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Events</h1>

        {events.length === 0 ? (
          <p>No events available</p>
        ) : (
          <div className="space-y-4">
            {events.map((e) => (
              <div key={e._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{e.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(e.date).toDateString()}
                </p>
                <p className="mt-2">{e.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Events;
