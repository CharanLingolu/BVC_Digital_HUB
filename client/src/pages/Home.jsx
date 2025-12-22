import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Welcome to BVC DigitalHub 🎓
        </h1>
        <p className="text-gray-600 mt-2">
          Explore projects, staff, events, and placements.
        </p>
      </div>
    </>
  );
};

export default Home;
