import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AuthCard from "../components/ui/AuthCard";
import PageContainer from "../components/ui/PageContainer";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", formData);
      toast.success(res.data.message);
      navigate("/otp", { state: { email: formData.email } });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <AuthCard title="Create Account">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

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
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </AuthCard>
    </PageContainer>
  );
};

export default Signup;
