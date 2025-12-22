import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AuthCard from "../components/ui/AuthCard";
import PageContainer from "../components/ui/PageContainer";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);

      // 🔐 Store JWT
      localStorage.setItem("token", res.data.token);

      toast.success(res.data.message);

      // Redirect to home (will create next)
      navigate("/home");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <AuthCard title="Login">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </AuthCard>
    </PageContainer>
  );
};

export default Login;
