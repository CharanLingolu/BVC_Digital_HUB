import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
 import Projects from "./pages/Projects";
 import Profile from "./pages/Profile";
 import Staff from "./pages/Staff";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

<Route
  path="/staff"
  element={
    <ProtectedRoute>
      <Staff />
    </ProtectedRoute>
  }
/>

<Route
  path="/events"
  element={
    <ProtectedRoute>
      <Events />
    </ProtectedRoute>
  }
/>

<Route
  path="/jobs"
  element={
    <ProtectedRoute>
      <Jobs />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
