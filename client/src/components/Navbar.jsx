import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="block px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 font-medium"
    >
      {children}
    </Link>
  );

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          BVC_DigitalHub
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/staff">Staff</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/jobs">Jobs</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <button
                onClick={handleLogout}
                className="text-red-500 font-medium px-3 py-2 hover:bg-red-50 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 space-y-2">
          {!token ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/staff">Staff</NavLink>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/jobs">Jobs</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded text-red-500 hover:bg-red-50 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
