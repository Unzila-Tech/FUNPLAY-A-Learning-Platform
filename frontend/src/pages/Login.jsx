import { API_BASE_URL } from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
       `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // If login failed
      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      // Go to Dashboard
      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      alert(
        "Server connection failed. Please make sure backend is running."
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo logo">
          <img
            src="/images/logo.png"
            alt="FunPlay Logo"
          />
        </div>

        <h1>Welcome Back!</h1>

        <p className="login-subtitle">
          Login to continue learning with FunPlay.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Password */}
          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          {/* Remember + Forgot */}
          <div className="login-options">

            <label className="remember">

              <input type="checkbox" />

              Remember me

            </label>

            <a href="#">
              Forgot Password?
            </a>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>

        {/* Register Link */}
        <p className="register-text">

          Don't have an account?

          <Link to="/register">
            {" "}Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;