import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              BVC DigitalHub
            </h1>

            <p className="text-lg text-blue-100 mb-8">
              A centralized platform for BVC students to showcase projects,
              explore faculty details, stay updated with events, and track
              placements — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/signup"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-50 transition"
              >
                Get Started
              </a>

              <a
                href="/login"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition"
              >
                Login
              </a>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex justify-center">
            <img
              src="https://illustrations.popsy.co/blue/student.svg"
              alt="Students"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why BVC DigitalHub?
          </h2>

          <p className="text-gray-600 text-lg">
            BVC DigitalHub helps students present academic projects, connect
            with peers, and stay informed about faculty, events, and placements
            — all through a single digital platform.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Feature Card */}
            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
              <h3 className="text-xl font-semibold mb-3">
                🎓 Student Projects
              </h3>
              <p className="text-gray-600">
                Showcase final-year projects with images, videos, GitHub links,
                and detailed descriptions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
              <h3 className="text-xl font-semibold mb-3">
                👩‍🏫 Faculty & Events
              </h3>
              <p className="text-gray-600">
                Explore department-wise faculty profiles and stay updated with
                ongoing college events.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition text-center">
              <h3 className="text-xl font-semibold mb-3">
                💼 Placements
              </h3>
              <p className="text-gray-600">
                Track placement updates, companies, and selected student
                information easily.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} BVC DigitalHub. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Landing;
